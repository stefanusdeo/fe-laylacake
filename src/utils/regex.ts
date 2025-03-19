export const urlRegex =
  /^(?:http(s)?:\/\/)?(?:www\.)?[\w.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
export const emailRegex = new RegExp(
  "^[a-zA-Z0-9._-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
);
export const phoneRegex = /^(08|02)[0-9]{7,}$/;
export const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
