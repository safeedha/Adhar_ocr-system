function calculateAge(dobString) {

  let [day, month, year] = dobString.split("/").map(Number);
  let dob = new Date(year, month - 1, day);

  let today = new Date();
  let age = today.getFullYear() - dob.getFullYear();


  let hasBirthdayPassed =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!hasBirthdayPassed) {
    age--;
  }

  return age;
}

export default calculateAge