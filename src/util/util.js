import dateFormat from 'dateformat'

export const getAge = (date) => {
    const today = new Date(dateFormat(new Date(), 'GMT:yyyy-mm-dd'));
    const birth_date = new Date(dateFormat(date, 'GMT:yyyy-mm-dd'));

    var age = today.getFullYear() - birth_date.getFullYear();
    const months = today.getMonth() - birth_date.getMonth();

    if(months < 0 || (months === 0 && today.getDate() < birth_date.getDate())){
        age--;
    }

    return age;
}