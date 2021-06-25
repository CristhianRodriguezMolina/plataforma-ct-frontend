import dateFormat from 'dateformat'

export const getAge = (date) => {
    const today = new Date(dateFormat(new Date(), 'GMT:yyyy-mm-dd'));
    const birth_date = new Date(dateFormat(date, 'GMT:yyyy-mm-dd'));

    var age = today.getFullYear() - birth_date.getFullYear();
    const months = today.getMonth() - birth_date.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < birth_date.getDate())) {
        age--;
    }

    return age;
}

export const arr_diff = (a1, a2) => {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}