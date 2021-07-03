// Date format
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

    for (i = 0; i < a2.length; i++) {
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

export const getRole = (role) => {
    if (role === 'admin') {
        return 'Administrador'
    } else if (role === 'teacher') {
        return 'Profesor'
    } else if (role === 'student') {
        return 'Estudiante'
    }
    return 'Error obteniendo el rol'
}

export const getGenre = (genre) => {
    if (genre === 'M') {
        return 'Masculino'
    } else if (genre === 'F') {
        return 'Femenino'
    } else if (genre === 'NB') {
        return 'No binario'
    }
    return 'Error obteniendo el genero'
}

export const getSpanishDate = (date) => {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    const auxDate = new Date(dateFormat(new Date(date), "GMT:yyyy/mm/dd")) // Se ponen slashes para que javascript lo detecte como una fecha con zona horaria local
    return `${auxDate.getDate()} de ${months[auxDate.getMonth()]} del ${auxDate.getFullYear()}`
}