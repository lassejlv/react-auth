export default function token() {
  // prettier-ignore
  // @ts-ignore
  return document.cookie.split(";").find((cookie) => cookie.trim().startsWith("token=")).split("=")[1];
}
