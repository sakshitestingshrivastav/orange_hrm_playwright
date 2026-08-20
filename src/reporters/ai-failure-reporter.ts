import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

// Ensure .env is loaded inside reporter process too
dotenv.config();

/**
 * Small AI helper for the framework:
 * 1) Always writes an AI-ready failure note under reports/ai-failures/
 * 2) If OPENAI_API_KEY exists, also asks OpenAI for a short diagnosis
 * 3) Emails only in CI when SEND_FAILURE_EMAIL=true (smoke/sanity workflow)
 */
class AiFailureReporter implements Reporter {
  private outputDir = path.join(process.cwd(), 'reports', 'ai-failures');

  async onTestEnd(test: TestCase, result: TestResult): Promise<void> {
    if (result.status !== 'failed' && result.status !== 'timedOut') {
      return;
    }

    fs.mkdirSync(this.outputDir, { recursive: true });

    const title = test.titlePath().join(' > ');
    const errorMessage = result.error?.message ?? 'Unknown error';
    const errorStack = result.error?.stack ?? '';
    const safeName = title
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\s+/g, '_')
      .slice(0, 80);

    const prompt = [
      'You are an SDET assistant. Analyze this Playwright test failure.',
      'Give: 1) likely root cause 2) what to check 3) a concrete fix suggestion.',
      'Keep it short and practical.',
      '',
      `Test: ${title}`,
      `Status: ${result.status}`,
      `Retries used: ${result.retry}`,
      '',
      'Error:',
      errorMessage,
      '',
      'Stack:',
      errorStack,
    ].join('\n');

    let aiDiagnosis = '';
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        aiDiagnosis = await this.askOpenAi(apiKey, prompt);
      } catch (error) {
        aiDiagnosis = `AI call failed: ${(error as Error).message}`;
      }
    } else {
      aiDiagnosis =
        'OPENAI_API_KEY not set. Paste the prompt section below into ChatGPT/Cursor for AI diagnosis.';
    }

    const report = [
      '# AI Failure Diagnosis',
      '',
      `**Test:** ${title}`,
      `**When:** ${new Date().toISOString()}`,
      '',
      '## AI Output',
      aiDiagnosis,
      '',
      '## Error',
      errorMessage,
      '',
      '## Prompt Sent / Ready for AI',
      '```',
      prompt,
      '```',
      '',
    ].join('\n');

    const filePath = path.join(this.outputDir, `${safeName}.md`);
    fs.writeFileSync(filePath, report, 'utf-8');
    console.log(`\nAI failure report: ${filePath}\n`);

    await this.sendFailureEmail({
      title,
      status: result.status,
      aiDiagnosis,
      errorMessage,
      filePath,
    });
  }

  /** Email only when both: running in CI, and smoke/sanity opted in via SEND_FAILURE_EMAIL. */
  private shouldSendEmail(): boolean {
    const inCi = process.env.CI === 'true';
    const emailEnabled = process.env.SEND_FAILURE_EMAIL === 'true';
    return inCi && emailEnabled;
  }

  private async sendFailureEmail(details: {
    title: string;
    status: string;
    aiDiagnosis: string;
    errorMessage: string;
    filePath: string;
  }): Promise<void> {
    if (!this.shouldSendEmail()) {
      console.log(
        'Email skipped: only sent in CI for smoke/sanity (CI=true and SEND_FAILURE_EMAIL=true).',
      );
      return;
    }

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
    const to = process.env.ALERT_EMAIL_TO;
    const from = process.env.ALERT_EMAIL_FROM || user;

    if (!host || !user || !pass || !to) {
      console.log(
        'Email skipped: set SMTP_HOST, SMTP_USER, SMTP_PASS, ALERT_EMAIL_TO secrets in CI.',
      );
      return;
    }

    if (user.includes('yourgmail@')) {
      console.log(
        'Email skipped: SMTP_USER is still a placeholder. Set it to your real Gmail address.',
      );
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });

      await transporter.verify();

      await transporter.sendMail({
        from,
        to,
        subject: `Playwright failure: ${details.title}`,
        text: [
          `Test: ${details.title}`,
          `Status: ${details.status}`,
          '',
          'Error:',
          details.errorMessage,
          '',
          'AI Diagnosis:',
          details.aiDiagnosis,
          '',
          `Local report file: ${details.filePath}`,
        ].join('\n'),
        attachments: [
          {
            filename: path.basename(details.filePath),
            path: details.filePath,
          },
        ],
      });

      console.log(`Failure email sent to: ${to}`);
    } catch (error) {
      const err = error as Error & { response?: string; code?: string };
      console.log(`Failure email failed: ${err.message}`);
      if (err.code) console.log(`Email error code: ${err.code}`);
      if (err.response) console.log(`Email response: ${err.response}`);
    }
  }

  private async askOpenAi(apiKey: string, prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: 'You are a senior SDET helping debug Playwright failures.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return data.choices?.[0]?.message?.content?.trim() || 'No AI response received.';
  }
}

export default AiFailureReporter;
