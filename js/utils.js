const goToTop = () => {
    $('html,body').animate({ scrollTop: 0 }, 'slow');
}

function scrollBtn () {
    if ($(this).scrollTop() > 550) {
        $('#goToTopBtn').fadeIn();
    }
    else {
        $('#goToTopBtn').fadeOut();
    }
}

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const convertMinsToHrsMins = (mins) => {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    h = h < 10 ? '' + h : h;
    m = m < 10 ? '' + m : m;

    if (h > 1) {
    return h + ' Hours ' + ' And ' + m + ' Minutes';
    } else {
        return h + ' Hour ' + ' And ' + m + ' Minutes';
    }
}

const convertMinsToHrsMinsHeb = (mins) => {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    h = h < 10 ? '' + h : h;
    m = m < 10 ? '' + m : m;

    if (h > 1) {
    return h + ' שעות ' + ' ו ' + m + ' דקות';
    } else {
        return ' שעה ' + ' ו ' + m + ' דקות';
    }
}

const changeMonthName = (month, type) => {
    if (type == 1) {
        switch (month) {
            case 0: {
                monthName = 'January';
                break;
            }
            case 1: {
                monthName = 'February';
                break;
            }
            case 2: {
                monthName = 'March';
                break;
            }
            case 3: {
                monthName = 'April';
                break;
            }
            case 4: {
                monthName = 'May';
                break;
            }
            case 5: {
                monthName = 'June';
                break;
            }
            case 6: {
                monthName = 'July';
                break;
            }
            case 7: {
                monthName = 'August';
                break;
            }
            case 8: {
                monthName = 'September';
                break;
            }
            case 9: {
                monthName = 'October';
                break;
            }
            case 10: {
                monthName = 'November';
                break;
            }
            case 11: {
                monthName = 'December';
                break;
            }  
        }
    } else {
        switch (month) {
            case 0: {
                monthName = 'Jan';
                break;
            }
            case 1: {
                monthName = 'Feb';
                break;
            }
            case 2: {
                monthName = 'March';
                break;
            }
            case 3: {
                monthName = 'April';
                break;
            }
            case 4: {
                monthName = 'May';
                break;
            }
            case 5: {
                monthName = 'June';
                break;
            }
            case 6: {
                monthName = 'July';
                break;
            }
            case 7: {
                monthName = 'Aug';
                break;
            }
            case 8: {
                monthName = 'Sep';
                break;
            }
            case 9: {
                monthName = 'Oct';
                break;
            }
            case 10: {
                monthName = 'Nov';
                break;
            }
            case 11: {
                monthName = 'Dec';
                break;
            }  
        }
    }
}

const changeDayName = (day) => {
    switch (day) {
        case 1:
        case 21:
        case 31: {
            dayName = day + 'st';
            break;
        }
        case 2:
        case 22: {
            dayName = day + 'nd';
            break;
        }
        case 3:
        case 23: {
            dayName = day + 'rd';
            break;
        }

        default: {
            dayName = day + 'th';
        }
    }
}

const changeMonthNameHeb = (month, type) => {
    if (type == 1) {
        switch (month) {
            case 0: {
                monthName = 'ינואר';
                break;
            }
            case 1: {
                monthName = 'פברואר';
                break;
            }
            case 2: {
                monthName = 'מרץ';
                break;
            }
            case 3: {
                monthName = 'אפריל';
                break;
            }
            case 4: {
                monthName = 'מאי';
                break;
            }
            case 5: {
                monthName = 'יוני';
                break;
            }
            case 6: {
                monthName = 'יולי';
                break;
            }
            case 7: {
                monthName = 'אוגוסט';
                break;
            }
            case 8: {
                monthName = 'ספטמבר';
                break;
            }
            case 9: {
                monthName = 'אוקטובר';
                break;
            }
            case 10: {
                monthName = 'נובמבר';
                break;
            }
            case 11: {
                monthName = 'דצמבר';
                break;
            }  
        }
    } else {
        switch (month) {
            case 0: {
                monthName = "ינו'";
                break;
            }
            case 1: {
                monthName = "פבר'";
                break;
            }
            case 2: {
                monthName = "מרץ";
                break;
            }
            case 3: {
                monthName = "אפר'";
                break;
            }
            case 4: {
                monthName = "מאי";
                break;
            }
            case 5: {
                monthName = "יונ'";
                break;
            }
            case 6: {
                monthName = "יול'";
                break;
            }
            case 7: {
                monthName = "אוג'";
                break;
            }
            case 8: {
                monthName = "ספט'";
                break;
            }
            case 9: {
                monthName = "אוק'";
                break;
            }
            case 10: {
                monthName = "נוב'";
                break;
            }
            case 11: {
                monthName = "דצמ'";
                break;
            }  
        }
    }
}

const changeDayNameHeb = (day) => {
    switch (day) {
        case 1:
        case 21:
        case 31: {
            dayName = day + ',';
            break;
        }
        case 2:
        case 22: {
            dayName = day + ',';
            break;
        }
        case 3:
        case 23: {
            dayName = day + ',';
            break;
        }

        default: {
            dayName = day + ',';
        }
    }
}

const getAge = (dateString, type, deadBirthDate) => {
    if (type == 1) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age; 
    } else {
        var today = new Date(dateString);
        var birthDate = new Date(deadBirthDate);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age; 
    }
}

const hasClass = (elem, className) => {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

const addClass = (elem, className) => {
    if (!hasClass(elem, className)) {
        elem.className += ' ' + className;
    }
}

const removeClass = (elem, className) => {
    var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}

const toggleClass = (elem, className) => {
    var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, " " ) + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(" " + className + " ") >= 0 ) {
            newClass = newClass.replace( " " + className + " " , " " );
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
        elem.className += ' ' + className;
    }
}

const removePopup = (container) => {
    $(document).mouseup((e) => {
        if (container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
            e.stopPropagation();
            $(document).off('mouseup');
        }
    })
}

const closeCurrentPopup = (that) => {
    $($(that)[0].parentElement.parentElement.parentElement).hide();
}

const backColor = (elem, color) => {
    $(elem).css('border', color);
}

const capitalize = (str) => {
    try {
        if (str.includes(' and ')) {
            str = str.replace(' and ', ' And ');
        } else if (str.includes('(and ')) {
            str = str.replace('(and ', '(And ');
        } else if(str == undefined || str == '') {
            return;
        }
    
        str = str.split(' ');
    
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }
    
        return str.join(" ");
    } catch (error) {

    }
}
