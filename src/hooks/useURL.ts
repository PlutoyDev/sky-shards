const relativeDatesMapNumber = {
  eytd: -2,
  ereyesterday: -2,
  ytd: -1,
  yesterday: -1,
  tdy: 0,
  today: 0,
  tmr: 1,
  tomorrow: 1,
  ovmr: 2,
  overmorrow: 2,
};

export function useURL() {
  const url = new URL(window.location.href);
  const urlParts = url.pathname.split('/');
  let daysToAdd = 0;
  for (let i = 0; i < urlParts.length; i++) {
    const part = urlParts[i];
    if (part in relativeDatesMapNumber) {
      daysToAdd = relativeDatesMapNumber[part as keyof typeof relativeDatesMapNumber];
      break;
    }
  }

  return { url, daysToAdd };
}
