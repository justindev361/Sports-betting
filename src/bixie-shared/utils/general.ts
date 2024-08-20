export const dateStr = (dateText: string) => {
  const date = new Date(dateText);
  return `${date.toLocaleString("en-US", { month: "short", day: "2-digit" })}`;
};

export const timeStr = (dateText: string) => {
  const date = new Date(dateText);
  return date.toLocaleTimeString('en-US', { hour12: true });
}

export const addClass = (selector: string, className: string) => {
  document.querySelectorAll(selector).forEach(element => element.classList.add(className));
}

export const removeClass = (selector: string, className: string) => {
  document.querySelectorAll(selector).forEach(element => element.classList.remove(className));
}

export const randomInt = (min: number, max: number) => {
  return min + Math.floor(Math.random() * (max - min));
}

/**
 * 
 * @returns before < after: -1
 * @returns before == after: 0
 * @returns before > after: 1
 */
export const compareTime = (before: string, after: string) => {
  const date1 = new Date(before);
  const date2 = new Date(after);

  return date1.getTime() < date2.getTime() ? -1 : date1.getTime() === date2.getTime() ? 0 : 1;
}