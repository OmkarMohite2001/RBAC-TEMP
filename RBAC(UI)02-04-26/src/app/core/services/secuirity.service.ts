import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationService } from './notification.service';
import DOMPurify from 'dompurify';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  constructor(
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService
  ) {}

  /**
   * Validates input against suspicious patterns for XSS and injection attacks
   * @param input The input to validate
   * @returns Object with validation result and detected issue
   */
  validateInput(input: string): { isValid: boolean; issue?: string } {
    if (!input) return { isValid: true };

    // Normalize input for better detection
    const normalizedInput = input.toLowerCase().replace(/\s+/g, ' ').trim();

    const suspiciousPatterns = [

      {
        pattern: /<[^>]+>/g,
        message: 'HTML content is not allowed',
      },

      // Script tags (various forms)
      {
        pattern: /<script[\s\S]*?<\/script>/gi,
        message: 'Script tag detected',
      },
      {
        pattern: /<script[^>]*>/gi,
        message: 'Script tag opening detected',
      },

      // JavaScript URIs and protocols
      {
        pattern: /javascript\s*:/gi,
        message: 'JavaScript URI detected',
      },
      {
        pattern: /vbscript\s*:/gi,
        message: 'VBScript URI detected',
      },
      {
        pattern: /data\s*:\s*[^,]*[,;]/gi,
        message: 'Data URI scheme detected',
      },

      // Event handlers (comprehensive list)
      {
        pattern:
          /on(abort|afterprint|beforeprint|beforeunload|blur|canplay|canplaythrough|change|click|contextmenu|copy|cuechange|cut|dblclick|drag|dragend|dragenter|dragleave|dragover|dragstart|drop|durationchange|emptied|ended|error|focus|focusin|focusout|fullscreenchange|fullscreenerror|hashchange|input|invalid|keydown|keypress|keyup|load|loadeddata|loadedmetadata|loadstart|message|mousedown|mouseenter|mouseleave|mousemove|mouseout|mouseover|mouseup|mousewheel|offline|online|pagehide|pageshow|paste|pause|play|playing|popstate|progress|ratechange|resize|reset|scroll|search|seeked|seeking|select|show|stalled|storage|submit|suspend|timeupdate|toggle|touchcancel|touchend|touchmove|touchstart|transitionend|unload|volumechange|waiting|wheel)\s*=/gi,
        message: 'Event handler attribute detected',
      },

      // HTML tags commonly used in XSS
      {
        pattern:
          /<(iframe|embed|object|applet|form|input|textarea|select|button|meta|link|style|base|frameset|frame)\b[^>]*>/gi,
        message: 'Potentially dangerous HTML tag detected',
      },

      // SQL injection patterns
      {
        pattern:
          /(union\s+select|insert\s+into|delete\s+from|update\s+set|drop\s+table|create\s+table|alter\s+table|exec\s*\(|execute\s*\()/gi,
        message: 'SQL injection pattern detected',
      },
      {
        pattern: /(['"])\s*(or|and)\s+\1?\s*\1?\s*=\s*\1?/gi,
        message: 'SQL injection boolean pattern detected',
      },
      {
        pattern:
          /\b(select|union|insert|update|delete|drop|create|alter|exec|execute)\s+[\w\s,*()]+\s+(from|into|where|set)\b/gi,
        message: 'SQL command structure detected',
      },

      // NoSQL injection patterns
      {
        pattern:
          /\$where|\$ne|\$gt|\$lt|\$gte|\$lte|\$in|\$nin|\$exists|\$regex/gi,
        message: 'NoSQL injection operator detected',
      },

      // LDAP injection patterns
      {
        pattern: /[()&|!*]+\s*=\s*[()&|!*]+/g,
        message: 'LDAP injection pattern detected',
      },

      // Command injection patterns
      // {
      //   // eslint-disable-next-line no-useless-escape
      //   pattern: /[;&|`$(){}[\]\\]|(\|\|)|(&&)|(\$\()|(\`.*\`)/g,
      //   message: 'Command injection characters detected',
      // },
      {
        pattern:
          /\b(eval|exec|system|shell_exec|passthru|proc_open|popen|file_get_contents|file_put_contents|fopen|fwrite|include|require|curl_exec)\s*\(/gi,
        message: 'Dangerous function call detected',
      },

      // Path traversal patterns
      {
        // eslint-disable-next-line no-useless-escape
        pattern: /\.\.[\/\\]|\.\.[\/\\].*[\/\\]/g,
        message: 'Path traversal pattern detected',
      },
      {
        // eslint-disable-next-line no-useless-escape
        pattern: /[\/\\](etc|proc|sys|var|tmp|boot|home|root)[\/\\]/gi,
        message: 'Sensitive system path detected',
      },

      // Server-side template injection
      {
        pattern: /\{\{.*\}\}|\{%.*%\}|\{#.*#\}/g,
        message: 'Template injection pattern detected',
      },

      // XML injection patterns
      {
        pattern: /<!\[CDATA\[|<\?xml|<!DOCTYPE|<!ENTITY/gi,
        message: 'XML injection pattern detected',
      },

      // Expression Language injection
      {
        pattern: /\$\{.*\}|#\{.*\}/g,
        message: 'Expression Language injection detected',
      },

      // Additional XSS vectors
      {
        pattern: /expression\s*\(/gi,
        message: 'CSS expression detected',
      },
      {
        pattern: /-moz-binding\s*:/gi,
        message: 'Mozilla binding detected',
      },
      {
        pattern: /\bimport\s*\(/gi,
        message: 'Dynamic import detected',
      },

      // // Base64 encoded patterns (common in attacks)
      {
        pattern: /(?:data:.*base64|base64\s*,)/gi,
        message: 'Base64 encoded content detected',
      },

      // // Unicode and encoding bypasses
      {
        pattern: /\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|&#x?[0-9a-f]+;/gi,
        message: 'Encoded characters detected',
      },

      // // Protocol handlers - remove http and https from below pattern
      {
        pattern: /\b(file|ftp|gopher|mailto|news|telnet)\s*:/gi,
        message: 'Protocol handler detected',
      },
    ];

    // Check each pattern
    for (const { pattern, message } of suspiciousPatterns) {
      if (pattern.test(input) || pattern.test(normalizedInput)) {
        return { isValid: false, issue: message };
      }
    }

    // Additional context-aware checks
    const suspiciousKeywords = [
      'alert',
      'confirm',
      'prompt',
      'eval',
      'setTimeout',
      'setInterval',
      'Function',
      'constructor',
      'prototype',
      'innerHTML',
      'outerHTML',
      'document.write',
      'document.writeln',
      'window.location',
      'location.href',
    ];

    const hasMultipleSuspiciousKeywords =
      suspiciousKeywords.filter(keyword =>
        normalizedInput.includes(keyword.toLowerCase())
      ).length >= 2;

    if (hasMultipleSuspiciousKeywords) {
      return {
        isValid: false,
        issue: 'Multiple suspicious JavaScript keywords detected',
      };
    }

    // Check for excessive special characters (potential encoding bypass)
    const specialCharRatio =
      (input.match(/[<>'"&%$#@!{}[\]\\|`~]/g) || []).length / input.length;
    if (specialCharRatio > 0.3) {
      return { isValid: false, issue: 'Excessive special characters detected' };
    }

    return { isValid: true };
  }

  /**
   * Shows a security alert for suspicious content
   * @param message The alert message
   * @param fieldName The name of the field with suspicious content
   */
  showSecurityAlert(message: string, fieldName: string): void {
    const alertMessage = `Security Warning: ${message} in field "${fieldName}". This data will not be sent.`;
    console.error(alertMessage);
    this.notificationService.notify('error', alertMessage, '500px');
  }

  /**
   * Sanitizes HTML content to prevent XSS
   * @param content The content to sanitize
   * @returns SafeHtml object
   */
  sanitizeHtml(content: string): SafeHtml {
     if (!content) return '';

    const sanitized = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });

    const encoded = this.encodeHtml(sanitized);

    return this.sanitizer.bypassSecurityTrustHtml(encoded);
  }

  sanitizeText(content: string): string {
    if (!content) return '';

    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  }


  /**
   * Encodes HTML to prevent XSS
   * @param value The value to encode
   * @returns Encoded HTML string
   */
  encodeHtml(value: string): string {
    if (!value) return '';

    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  /**
   * Returns security headers for HTTP requests
   * @returns Object containing security headers
   */
  getSecurityHeaders(): Record<string, string> {
    return {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'",
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    };
  }
}
 