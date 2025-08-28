function getAddress(backline)
{
   let start = backline.findIndex(l => /\b(S\/O|D\/O|C\/O|W\/O|H\/O|F\/O|M\/O|S\/0)\b/i.test(l));
   const pinIndex = backline.findIndex(l => /\b\d{6}\b/.test(l));
   const address=backline.slice(start, pinIndex).join(" ");
   return address
}

export default getAddress