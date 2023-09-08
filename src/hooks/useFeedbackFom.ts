import { Settings as LuxonSettings } from 'luxon';

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

  const size = window.innerWidth + 'x' + window.innerHeight;
  const locale = navigator.language;
  const timeZone = tryDefault(
    () => LuxonSettings.defaultZone.name,
    tryDefault(() => Intl.DateTimeFormat().resolvedOptions().timeZone, 'unknown'),
  );
  const userAgent = tryDefault(() => navigator.userAgent, 'unknown');

  debugInfo +=
    `--Device info (Feel free to delete it)--\n` +
    `Size: ${size}\nLocale: ${locale}\nTime zone: ${timeZone}\nUser agent: ${userAgent}`;

  if (params?.debugInfo) {
    debugInfo += `--Custom--\n${params.debugInfo}`;
  } else if (params?.error) {
    const error = params.error;
    debugInfo += `--App crashed--\n` + (error instanceof Error ? `${error.stack}` : error);
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
