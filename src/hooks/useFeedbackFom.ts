import { Settings as LuxonSettings } from 'luxon';
import i18n from '../i18n';

const prefilledId = {
  debugInfo: 'entry.402545620',
  type: 'entry.1859327625',
  content: 'entry.353300504',
};

interface FeedbackFormParams {
  error?: unknown;
  debugInfo?: string;
  type?: string;
  content?: string;
}

const tryDefault = <T>(fn: () => T, defaultValue: T | (() => T)): T => {
  try {
    return fn();
  } catch (e) {
    return typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue;
  }
};

export default function useFeedbackFormUrl(params?: FeedbackFormParams) {
  const branchName = import.meta.env.VITE_GIT_BRANCH ?? 'undefiend';
  const commitSha = import.meta.env.VITE_GIT_COMMIT ?? 'undefiend';
  const baseLink =
    'https://docs.google.com/forms/d/e/1FAIpQLSf8CvIDxHz9hFkzaK-CFsGDKqIjiuAt4IDzigI8WjQnNBx6Ww/viewform';

  let debugInfo = `--App info--\nBranch: ${branchName}\nCommit: ${commitSha}\n`;

  const appLang = i18n.language;
  const appTimezone = LuxonSettings.defaultZone.name;

  debugInfo += `Locale: ${appLang}\nTime zone: ${appTimezone}\n`;

  const size = window.innerWidth + 'x' + window.innerHeight;
  const locales = tryDefault(() => navigator.languages.join(', '), 'unknown');
  const timeZone = tryDefault(() => Intl.DateTimeFormat().resolvedOptions().timeZone, 'unknown');
  const userAgent = tryDefault(() => navigator.userAgent, 'unknown');

  debugInfo +=
    `--Device info (Feel free to delete it)--\n` +
    `Size: ${size}\nLocale: ${locales}\nTime zone: ${timeZone}\nUser agent: ${userAgent}\n`;

  if (params?.debugInfo) {
    debugInfo += `--Custom--\n${params.debugInfo}\n`;
  } else if (params?.error) {
    const error = params.error;
    debugInfo += `--App crashed--\n` + (error instanceof Error ? `${error.stack}` : error) + '\n';
    params.type = 'App Crashed';
  }

  const formUrlParams = new URLSearchParams();
  formUrlParams.append('usp', 'pp_url');
  formUrlParams.append(prefilledId.debugInfo, debugInfo);
  if (params?.type) {
    formUrlParams.append(prefilledId.type, params.type);
  }
  if (params?.content) {
    formUrlParams.append(prefilledId.content, params.content);
  }

  const formUrl = `${baseLink}?${formUrlParams.toString()}`;
  return formUrl;
}
