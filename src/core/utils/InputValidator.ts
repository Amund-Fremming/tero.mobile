const textRegex = /^[A-Za-z]+$/;
const numberRegex = /^[0-9]+$/;
const usernameRegex = /^[A-Za-z0-9]+$/;

export const validText = (input: string): boolean => {
  return textRegex.test(input);
};

export const validNumber = (input: string): boolean => {
  return numberRegex.test(input);
};

export const validUsername = (input: string): boolean => {
  return usernameRegex.test(input);
};

export const validMaxLength = (
  input: string,
  maxChars: number,
  displayErrorModal: (message: string) => void,
): boolean => {
  if (input.length > maxChars) {
    displayErrorModal(`Teksten kan ikke være lengre enn ${maxChars} tegn.`);
    return false;
  }
  return true;
};

export default { validText, validNumber, validUsername, validMaxLength };
