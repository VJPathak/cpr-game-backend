import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

const SECRET_KEY = 'ZD1mVpAr29';

@Injectable()
export class CommonUtilsService {
  static roundNumber = (num: number, decimals = 2) => {
    const t = Math.pow(10, decimals);
    let result = Math.round((num + Number.EPSILON) * t) / t;
    if (num < 0) {
      result = result * -1;
    }
    return result;
  };

  static getDisplayName(email) {
    if (!email || !email.includes('@')) {
      return 'Invalid email';
    }
    const [localPart] = email.split('@');
    const companyName = this.getCompanyName(email);
    if (companyName === 'Personal') {
      return localPart;
    }
    return `${localPart}-${companyName.toLowerCase()}`;
  }

  static getCompanyName = (email) => {
    if (!email || !email.includes('@')) {
      return 'Invalid email';
    }
    const domain = email.split('@')[1].toLowerCase();
    const personalDomains = [
      'gmail.com',
      'outlook.com',
      'yahoo.com',
      'hotmail.com',
      'aol.com',
      'icloud.com',
      'protonmail.com',
      'zoho.com',
      'mail.com',
      'gmx.com',
    ];
    if (personalDomains.includes(domain)) {
      return 'Personal';
    }
    const companyName = domain.split('.')[0];
    return companyName.charAt(0).toUpperCase() + companyName.slice(1);
  };

  static delaySeconds = async (seconds) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(seconds * 1000);
  };

  static getExtension = (filename: string) => {
    return filename.split('.').pop();
  };

  static encrypt = (text: string): string => {
    const key = crypto.scryptSync(SECRET_KEY, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  };

  static decrypt = (encryptedText: string): string => {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = crypto.scryptSync(SECRET_KEY, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  };

  static determineTag = (summary: string | undefined): string => {
    if (!summary) return 'Other';
    const normalizedSummary = summary.toLowerCase();

    if (/(demo|presentation|onboarding|qbr|review)/.test(normalizedSummary)) {
      return 'Client Meetings';
    } else if (/(sales|pitch|proposal|discovery)/.test(normalizedSummary)) {
      return 'Sales Meetings';
    } else if (/(standup|all-hands|team sync)/.test(normalizedSummary)) {
      return 'Recurring Meetings';
    } else if (/(1:1|personal|one on one)/.test(normalizedSummary)) {
      return 'One-on-One Meetings';
    } else if (/(interview|screening|candidate)/.test(normalizedSummary)) {
      return 'Recruitment Meetings';
    } else if (/(vendor|partner|sync)/.test(normalizedSummary)) {
      return 'Vendor Meetings';
    } else if (
      /(training|workshop|learning|certification)/.test(normalizedSummary)
    ) {
      return 'Training Meetings';
    } else {
      return 'Other';
    }
  };
}
