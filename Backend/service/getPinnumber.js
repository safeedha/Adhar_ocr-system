function getPin(backline)
{
     const pinIndex = backline.findIndex(l => /\b\d{6}\b/.test(l));
     let pinlinetext=backline.slice(pinIndex,pinIndex+1).toString()
     console.log("pinlinetest",pinlinetext)
      let firstIndex= pinlinetext.search(/\d/);

     let pin=pinlinetext.slice(firstIndex,firstIndex+7)

   return pin
}
export default getPin