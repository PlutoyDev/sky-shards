import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMinus, FaPlus, FaExclamation } from 'react-icons/fa';
import i18next from 'i18next';
import { Settings as LuxonSettings, SystemZone } from 'luxon';
import { ModalProps } from '../../context/ModalContext';
import { useSettings } from '../../context/Settings';
import { languageCode, languageResources } from '../../i18n';

const timezonesJson =
  '["Africa/Abidjan","Africa/Accra","Africa/Addis_Ababa","Africa/Algiers","Africa/Asmera","Africa/Bamako","Africa/Bangui","Africa/Banjul","Africa/Bissau","Africa/Blantyre","Africa/Brazzaville","Africa/Bujumbura","Africa/Cairo","Africa/Casablanca","Africa/Ceuta","Africa/Conakry","Africa/Dakar","Africa/Dar_es_Salaam","Africa/Djibouti","Africa/Douala","Africa/El_Aaiun","Africa/Freetown","Africa/Gaborone","Africa/Harare","Africa/Johannesburg","Africa/Juba","Africa/Kampala","Africa/Khartoum","Africa/Kigali","Africa/Kinshasa","Africa/Lagos","Africa/Libreville","Africa/Lome","Africa/Luanda","Africa/Lubumbashi","Africa/Lusaka","Africa/Malabo","Africa/Maputo","Africa/Maseru","Africa/Mbabane","Africa/Mogadishu","Africa/Monrovia","Africa/Nairobi","Africa/Ndjamena","Africa/Niamey","Africa/Nouakchott","Africa/Ouagadougou","Africa/Porto-Novo","Africa/Sao_Tome","Africa/Tripoli","Africa/Tunis","Africa/Windhoek","America/Adak","America/Anchorage","America/Anguilla","America/Antigua","America/Araguaina","America/Argentina/La_Rioja","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan","America/Argentina/San_Luis","America/Argentina/Tucuman","America/Argentina/Ushuaia","America/Aruba","America/Asuncion","America/Bahia","America/Bahia_Banderas","America/Barbados","America/Belem","America/Belize","America/Blanc-Sablon","America/Boa_Vista","America/Bogota","America/Boise","America/Buenos_Aires","America/Cambridge_Bay","America/Campo_Grande","America/Cancun","America/Caracas","America/Catamarca","America/Cayenne","America/Cayman","America/Chicago","America/Chihuahua","America/Ciudad_Juarez","America/Coral_Harbour","America/Cordoba","America/Costa_Rica","America/Creston","America/Cuiaba","America/Curacao","America/Danmarkshavn","America/Dawson","America/Dawson_Creek","America/Denver","America/Detroit","America/Dominica","America/Edmonton","America/Eirunepe","America/El_Salvador","America/Fort_Nelson","America/Fortaleza","America/Glace_Bay","America/Godthab","America/Goose_Bay","America/Grand_Turk","America/Grenada","America/Guadeloupe","America/Guatemala","America/Guayaquil","America/Guyana","America/Halifax","America/Havana","America/Hermosillo","America/Indiana/Knox","America/Indiana/Marengo","America/Indiana/Petersburg","America/Indiana/Tell_City","America/Indiana/Vevay","America/Indiana/Vincennes","America/Indiana/Winamac","America/Indianapolis","America/Inuvik","America/Iqaluit","America/Jamaica","America/Jujuy","America/Juneau","America/Kentucky/Monticello","America/Kralendijk","America/La_Paz","America/Lima","America/Los_Angeles","America/Louisville","America/Lower_Princes","America/Maceio","America/Managua","America/Manaus","America/Marigot","America/Martinique","America/Matamoros","America/Mazatlan","America/Mendoza","America/Menominee","America/Merida","America/Metlakatla","America/Mexico_City","America/Miquelon","America/Moncton","America/Monterrey","America/Montevideo","America/Montreal","America/Montserrat","America/Nassau","America/New_York","America/Nipigon","America/Nome","America/Noronha","America/North_Dakota/Beulah","America/North_Dakota/Center","America/North_Dakota/New_Salem","America/Ojinaga","America/Panama","America/Pangnirtung","America/Paramaribo","America/Phoenix","America/Port-au-Prince","America/Port_of_Spain","America/Porto_Velho","America/Puerto_Rico","America/Punta_Arenas","America/Rainy_River","America/Rankin_Inlet","America/Recife","America/Regina","America/Resolute","America/Rio_Branco","America/Santa_Isabel","America/Santarem","America/Santiago","America/Santo_Domingo","America/Sao_Paulo","America/Scoresbysund","America/Sitka","America/St_Barthelemy","America/St_Johns","America/St_Kitts","America/St_Lucia","America/St_Thomas","America/St_Vincent","America/Swift_Current","America/Tegucigalpa","America/Thule","America/Thunder_Bay","America/Tijuana","America/Toronto","America/Tortola","America/Vancouver","America/Whitehorse","America/Winnipeg","America/Yakutat","America/Yellowknife","Antarctica/Casey","Antarctica/Davis","Antarctica/DumontDUrville","Antarctica/Macquarie","Antarctica/Mawson","Antarctica/McMurdo","Antarctica/Palmer","Antarctica/Rothera","Antarctica/Syowa","Antarctica/Troll","Antarctica/Vostok","Arctic/Longyearbyen","Asia/Aden","Asia/Almaty","Asia/Amman","Asia/Anadyr","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Baghdad","Asia/Bahrain","Asia/Baku","Asia/Bangkok","Asia/Barnaul","Asia/Beirut","Asia/Bishkek","Asia/Brunei","Asia/Calcutta","Asia/Chita","Asia/Choibalsan","Asia/Colombo","Asia/Damascus","Asia/Dhaka","Asia/Dili","Asia/Dubai","Asia/Dushanbe","Asia/Famagusta","Asia/Gaza","Asia/Hebron","Asia/Hong_Kong","Asia/Hovd","Asia/Irkutsk","Asia/Jakarta","Asia/Jayapura","Asia/Jerusalem","Asia/Kabul","Asia/Kamchatka","Asia/Karachi","Asia/Katmandu","Asia/Khandyga","Asia/Krasnoyarsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Kuwait","Asia/Macau","Asia/Magadan","Asia/Makassar","Asia/Manila","Asia/Muscat","Asia/Nicosia","Asia/Novokuznetsk","Asia/Novosibirsk","Asia/Omsk","Asia/Oral","Asia/Phnom_Penh","Asia/Pontianak","Asia/Pyongyang","Asia/Qatar","Asia/Qostanay","Asia/Qyzylorda","Asia/Rangoon","Asia/Riyadh","Asia/Saigon","Asia/Sakhalin","Asia/Samarkand","Asia/Seoul","Asia/Shanghai","Asia/Singapore","Asia/Srednekolymsk","Asia/Taipei","Asia/Tashkent","Asia/Tbilisi","Asia/Tehran","Asia/Thimphu","Asia/Tokyo","Asia/Tomsk","Asia/Ulaanbaatar","Asia/Urumqi","Asia/Ust-Nera","Asia/Vientiane","Asia/Vladivostok","Asia/Yakutsk","Asia/Yekaterinburg","Asia/Yerevan","Atlantic/Azores","Atlantic/Bermuda","Atlantic/Canary","Atlantic/Cape_Verde","Atlantic/Faeroe","Atlantic/Madeira","Atlantic/Reykjavik","Atlantic/South_Georgia","Atlantic/St_Helena","Atlantic/Stanley","Australia/Adelaide","Australia/Brisbane","Australia/Broken_Hill","Australia/Currie","Australia/Darwin","Australia/Eucla","Australia/Hobart","Australia/Lindeman","Australia/Lord_Howe","Australia/Melbourne","Australia/Perth","Australia/Sydney","Europe/Amsterdam","Europe/Andorra","Europe/Astrakhan","Europe/Athens","Europe/Belgrade","Europe/Berlin","Europe/Bratislava","Europe/Brussels","Europe/Bucharest","Europe/Budapest","Europe/Busingen","Europe/Chisinau","Europe/Copenhagen","Europe/Dublin","Europe/Gibraltar","Europe/Guernsey","Europe/Helsinki","Europe/Isle_of_Man","Europe/Istanbul","Europe/Jersey","Europe/Kaliningrad","Europe/Kiev","Europe/Kirov","Europe/Lisbon","Europe/Ljubljana","Europe/London","Europe/Luxembourg","Europe/Madrid","Europe/Malta","Europe/Mariehamn","Europe/Minsk","Europe/Monaco","Europe/Moscow","Europe/Oslo","Europe/Paris","Europe/Podgorica","Europe/Prague","Europe/Riga","Europe/Rome","Europe/Samara","Europe/San_Marino","Europe/Sarajevo","Europe/Saratov","Europe/Simferopol","Europe/Skopje","Europe/Sofia","Europe/Stockholm","Europe/Tallinn","Europe/Tirane","Europe/Ulyanovsk","Europe/Uzhgorod","Europe/Vaduz","Europe/Vatican","Europe/Vienna","Europe/Vilnius","Europe/Volgograd","Europe/Warsaw","Europe/Zagreb","Europe/Zaporozhye","Europe/Zurich","Indian/Antananarivo","Indian/Chagos","Indian/Christmas","Indian/Cocos","Indian/Comoro","Indian/Kerguelen","Indian/Mahe","Indian/Maldives","Indian/Mauritius","Indian/Mayotte","Indian/Reunion","Pacific/Apia","Pacific/Auckland","Pacific/Bougainville","Pacific/Chatham","Pacific/Easter","Pacific/Efate","Pacific/Enderbury","Pacific/Fakaofo","Pacific/Fiji","Pacific/Funafuti","Pacific/Galapagos","Pacific/Gambier","Pacific/Guadalcanal","Pacific/Guam","Pacific/Honolulu","Pacific/Johnston","Pacific/Kiritimati","Pacific/Kosrae","Pacific/Kwajalein","Pacific/Majuro","Pacific/Marquesas","Pacific/Midway","Pacific/Nauru","Pacific/Niue","Pacific/Norfolk","Pacific/Noumea","Pacific/Pago_Pago","Pacific/Palau","Pacific/Pitcairn","Pacific/Ponape","Pacific/Port_Moresby","Pacific/Rarotonga","Pacific/Saipan","Pacific/Tahiti","Pacific/Tarawa","Pacific/Tongatapu","Pacific/Truk","Pacific/Wake","Pacific/Wallis"]';
const timezones = JSON.parse(timezonesJson);

const systemZone = SystemZone.instance.name;

export default function SettingModal({ hideModal }: ModalProps) {
  const { t } = useTranslation('settings');
  const { lightMode, twelveHourMode, timezone, lang, gsTrans, languageLoader, fontSize, setSettings } = useSettings();
  const [gsTransState, setGsTransState] = useState<{ state?: 'loading' | 'error'; codeLangs?: Record<string, string> }>(
    {},
  );

  useEffect(() => {
    if (gsTrans && import.meta.env.VITE_GS_TRANSLATION_URL) {
      setGsTransState({ state: 'loading' });
      fetch((import.meta.env.VITE_GS_TRANSLATION_URL as string) + '?langCodeOnly=true', { credentials: 'omit' })
        .then(res => res.json())
        .then((response: Record<string, string>) => {
          setGsTransState({ codeLangs: response });
        })
        .catch(err => {
          setGsTransState({ state: 'error' });
          console.error(err);
        });
    }
  }, []);

  return (
    <div className='mb-4 flex flex-col justify-center gap-2 md:grid md:grid-cols-2 [&>div]:w-full [&>div]:px-2'>
      {/* Theme */}
      <div>
        <p className='text-bold w-full md:text-center'>{t('theme.title')}</p>
        <div className='join m-1.5 mx-auto w-full rounded-full px-2'>
          {[
            [t('theme.light'), 'true'],
            [t('theme.system'), 'system'],
            [t('theme.dark'), 'false'],
          ].map(([label, value]) => (
            <button
              key={value}
              className='btn btn-primary join-item btn-xs flex-1 whitespace-nowrap'
              disabled={lightMode === value}
              onClick={() => setSettings({ lightMode: value as 'true' | 'system' | 'false' })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {/* Time format */}
      <div>
        <p className='text-bold w-full md:text-center'>{t('clockFmt.title')}</p>
        <div className='join m-1.5 mx-auto w-full rounded-full px-2'>
          {[
            [t('clockFmt.twelve'), 'true'],
            [t('clockFmt.system'), 'system'],
            [t('clockFmt.twentyFour'), 'false'],
          ].map(([label, value]) => (
            <button
              key={value}
              className='btn btn-primary join-item btn-xs flex-1 whitespace-nowrap'
              disabled={twelveHourMode === value}
              onClick={() => setSettings({ twelveHourMode: value as 'true' | 'system' | 'false' })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {/* Timezone */}
      <div>
        <p className='text-md flex w-full justify-around md:block md:text-center'>
          <span>{t('timezones.title')}</span>
          <span
            className='ml-auto cursor-pointer text-xs underline md:ml-4'
            onClick={() => setSettings({ timezone: 'system' })}
          >
            {t('timezones.reset')}
          </span>
        </p>
        <select
          className='no-scrollbar select select-primary select-xs mt-1 w-full bg-primary text-primary-content'
          onChange={e => setSettings({ timezone: e.target.value === systemZone ? 'system' : e.target.value })}
          value={timezone === 'system' ? systemZone : timezone}
        >
          {timezones.map((tz: string) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>
      {/* Language */}
      <div>
        <p className='text-md flex w-full justify-start md:block md:text-center'>
          <span>{t('language.title')}</span>
          {
            // Google Sheets Translation
            gsTransState.state === 'loading' ? (
              <span className='loading loading-spinner loading-xs ml-auto cursor-pointer text-xs underline md:ml-4'></span>
            ) : gsTransState.state === 'error' ? (
              <FaExclamation height={'1em'} width={'1em'} />
            ) : null
          }
        </p>

        <select
          className='no-scrollbar select select-primary select-xs mt-1 w-full bg-primary text-primary-content'
          onChange={e => setSettings({ lang: e.target.value })}
          value={lang}
        >
          <option value='en'>{languageCode.en}</option>
          {Object.keys(languageResources).map(lang => (
            <option key={lang} value={lang}>
              {lang in languageCode ? languageCode[lang as keyof typeof languageCode] : lang}
            </option>
          ))}
          {
            // Google Sheets Translation
            gsTransState.codeLangs &&
              Object.entries(gsTransState.codeLangs).map(([code, name]) => {
                code = `${code}-GS`;
                return (
                  <option key={code} value={code}>
                    {name} (GS)
                  </option>
                );
              })
          }
        </select>
        {/* Display loading/error state */}
        {languageLoader?.loading ? (
          <div className='mt-2 flex w-full flex-row items-center justify-around gap-4 rounded-md bg-warning px-2 py-1 text-warning-content'>
            <span className='loading loading-spinner loading-xs'></span>
            <span className='flex-1 text-xs'>Loading...</span>
          </div>
        ) : languageLoader?.error ? (
          <div className='mt-2 flex w-full flex-row items-center justify-around gap-4 rounded-md bg-error px-2 py-1 text-error-content'>
            <FaExclamation height={'1rem'} width={'1rem'} />
            <span className='flex-1 text-xs'>{languageLoader.error}</span>
          </div>
        ) : null}
      </div>

      {/* Font Size */}
      <div className='w-full md:col-span-2'>
        <p className='text-bold w-full text-center'>{t('fontSize.title')}</p>
        <div className='mt-1 flex w-full flex-row items-center justify-center gap-2'>
          <button
            className='btn btn-circle btn-primary btn-xs'
            onClick={() => setSettings({ fontSize: (parseFloat(fontSize) - 0.1).toFixed(1) })} // 0.1 is the step
          >
            <FaMinus size={12} />
          </button>
          <p>{fontSize}</p>
          <button
            className='btn btn-circle btn-primary btn-xs'
            onClick={() => setSettings({ fontSize: (parseFloat(fontSize) + 0.1).toFixed(1) })} // 0.1 is the step
          >
            <FaPlus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
