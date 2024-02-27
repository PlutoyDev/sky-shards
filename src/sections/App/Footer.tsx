import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { BiLinkExternal } from 'react-icons/bi';
import { BsGithub, BsTable } from 'react-icons/bs';
import { TbForms } from 'react-icons/tb';
import { Settings as LuxonSettings } from 'luxon';
import { patternCredits } from '../../data/credits';
import useFeedbackFormUrl from '../../hooks/useFeedbackFom';

interface SubFooterProps {
  className?: string;
  children: ReactNode;
}

function SubFooter({ className, children }: SubFooterProps) {
  return (
    <div className={`w-full max-w-full ${className}`} style={{ height: 'calc(100% - 4rem)' }}>
      {children}
    </div>
  );
}

function AppDetailFooter() {
  const { t } = useTranslation('footer');
  const version = import.meta.env.VITE_VERSION_MINOR ?? 'undefiend';

  const feedbackUrl = useFeedbackFormUrl();
  return (
    <SubFooter className='flex flex-col gap-2'>
      <div className='flex w-full flex-1 flex-row flex-wrap items-center justify-center gap-x-1 lg:gap-x-3'>
        <div>
          <p className='text-center text-sm'>{t('createdBy', { author: 'Plutoy' })}</p>
          <p className='text-center'>{t('version', { version })}</p>
        </div>
        <div className='mt-1 flex flex-row flex-wrap items-center justify-center gap-1'></div>
        <a
          href='https://github.com/PlutoyDev/sky-shards'
          target='_blank'
          rel='noreferrer'
          className='block rounded-xl bg-black px-2 pb-1 pt-0.5 text-white'
        >
          <BsGithub className='text-md mr-2 inline-block' />
          <span className='text-sm font-bold max-sm:hidden'>{t('githubSourceLong')}</span>
          <span className='text-sm font-bold sm:hidden'>{t('githubSourceShort')}</span>
        </a>
        <a
          href={feedbackUrl}
          target='_blank'
          rel='noreferrer'
          className='block rounded-xl bg-purple-700 px-2 pb-1 pt-0.5 text-white'
        >
          <TbForms className='text-md mr-2 inline-block' />
          <span className='text-sm font-bold max-sm:hidden'>{t('feedbackLong')}</span>
          <span className='text-sm font-bold sm:hidden'>{t('feedbackShort')}</span>
        </a>
      </div>
      <p className='text-center max-xs:hidden xs:text-[8px] md:text-xs'>{t('disclaimer')}</p>
    </SubFooter>
  );
}

function PattenCreditFooter() {
  const { t } = useTranslation('footer');
  return (
    <SubFooter className='flex flex-col items-center justify-center gap-y-1'>
      <p className='text-center text-xs md:text-sm'>{t('patternCredit')}</p>
      <p className='flex w-full select-none flex-row flex-wrap items-center justify-center gap-x-1.5 whitespace-nowrap max-md:text-xs'>
        {patternCredits.map(u => (
          <span key={u}>{u}</span>
        ))}
      </p>
    </SubFooter>
  );
}

function TranslatorsFooter() {
  const { t, i18n } = useTranslation('footer');
  const translationErrorLink = t('translationErrorLink', {
    commitHash: import.meta.env.VITE_GIT_COMMIT,
    language: i18n.language,
  });
  let translators = [] as string[];
  try {
    const tCsv = t('translators');
    if (tCsv.length !== 0) {
      translators = t('translators')
        .split(',')
        .map(t => t.trim());
    }
  } catch (e) {
    translators = [`Error in translator list: ${e}`];
  }
  return (
    <SubFooter className='flex flex-col items-center justify-center gap-y-1'>
      <p className='text- flex w-full select-none flex-row flex-wrap items-center justify-center gap-x-1.5 whitespace-nowrap'>
        <span className='text-center text-xs md:text-sm'>{t('translatedBy')}</span>
        {translators.map(t => (
          <span key={t}>{t}</span>
        ))}
      </p>
      <p className='text-center text-xs'>
        <Trans
          t={t}
          i18nKey='translationErrors'
          components={{
            a: (
              <a
                className='underline decoration-dashed'
                title='Report translation error'
                href={translationErrorLink}
                target='_blank'
                rel='noreferrer'
              />
            ),
          }}
        />
      </p>
    </SubFooter>
  );
}

function HelpTranslation() {
  return (
    <SubFooter className='flex flex-col items-center justify-center gap-y-1'>
      <p className='text-center text-sm'>Help to translate this website to your language</p>
      <a
        href='https://docs.google.com/spreadsheets/d/16eSANTI310SY8uWjsjbxNBzyD-49hwF3OGYRkFPykoo/edit#gid=0&range=A5:B5'
        target='_blank'
        rel='noreferrer'
        className='block rounded-xl bg-green-700 px-2 pb-1 pt-0.5 text-white'
      >
        <BsTable className='text-md mr-2 inline-block' />
        <span className='text-sm font-bold'>Translation Sheet</span>
      </a>
    </SubFooter>
  );
}

function InspiredByFooter() {
  const { t } = useTranslation('footer');
  return (
    <SubFooter className='justify-cen ter flex flex-col flex-nowrap items-center justify-center gap-x-3 md:gap-x-6 landscape:flex-row'>
      <p>{t('inspiredBy')}</p>
      <a
        target='_blank'
        rel='noreferrer'
        href='https://sky-clock.netlify.app/'
        className='z-10 grid cursor-pointer grid-rows-2 rounded-lg border border-zinc-500 px-2 text-center shadow-2xl shadow-zinc-700  '
        style={{ gridTemplateColumns: 'max-content min-content max-content' }}
      >
        <img className='ml-auto mt-1.5 h-4 w-4' src='/ext/sky-clock.webp' alt='Sky Clock App Icon' />
        <h2 className='mx-2 whitespace-nowrap text-center'>
          <span className='text-sm underline'>Sky Clock</span>
          <span className='text-xs'> by Chris Stead</span>
        </h2>
        <BiLinkExternal className='mt-1.5 self-start' />
        <p className='col-span-3 whitespace-normal text-xs'>{t('skyClockDescription')}</p>
      </a>
    </SubFooter>
  );
}

const durationPerSection = 5; // seconds

export function Footer() {
  const [currentSection, setCurrentSection] = useState(0);
  const { i18n, t } = useTranslation('footer');

  const subfooters = useMemo(() => {
    const subfooters = [
      { key: 'app-detail', Footer: AppDetailFooter },
      { key: 'pattern-credit', Footer: PattenCreditFooter },
      { key: 'inspired-by', Footer: InspiredByFooter },
    ] as { key: string; Footer: () => JSX.Element }[];

    const translators = t('translators');

    if (i18n.language !== 'en' && translators.length > 0) {
      subfooters.splice(2, 0, { key: 'translators-credit', Footer: TranslatorsFooter });
    } else if (i18n.language === 'en') {
      subfooters.splice(2, 0, { key: 'help-translate', Footer: HelpTranslation });
    }

    return subfooters;
  }, [i18n.language, LuxonSettings.defaultZone.name]);

  const numSubfooters = subfooters.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection(prev => (prev + 1) % numSubfooters);
    }, durationPerSection * 5000);
    return () => clearInterval(interval);
  }, [numSubfooters]);

  const transY = (-100 / numSubfooters) * currentSection;

  return (
    <footer className='glass h-28 w-full overflow-y-hidden !py-0'>
      <div
        className='flex w-full flex-col items-center justify-evenly transition-transform'
        style={{
          height: numSubfooters * 100 + '%',
          transform: `translateY(${transY}%)`,
        }}
      >
        {subfooters.map(({ key, Footer }) => (
          <Footer key={key} />
        ))}
      </div>
    </footer>
  );
}

export default Footer;
