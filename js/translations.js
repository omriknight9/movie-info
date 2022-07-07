const changeLang = (langNum) => {
    if (langNum == 1) {
        lang = 'he';
        $('#isFlag').css({'pointer-events': 'none', 'opacity': '.5'});
        $('#usFlag').css({'pointer-events': 'all', 'opacity': '1'});
        $("head").append("<link rel='stylesheet' type='text/css' href='css/main_he.min.css' id='hebCss'/>");
        $('#searchMovie').attr('placeholder', 'חפש סרטים, סדרות או אנשים');
        $('#switchContentBtn').html('בקרוב');
        $('#switchContentBtn2').html('טרנדי');
        $('#switchContentBtn3').html('עכשיו בקולנוע');
        $('#noInstagramPop h2').html('אין פרופיל אינסטגרם');
        $('#noImdbPop h2').html('אין פרופיל IMDB');
        $('#changeUsernamePop h2').html('שינוי שם משתמש');
        $('#noInstagramPop .popupBtn').html('סגור');
        $('#noImdbPop .popupBtn').html('סגור');
        $('#closeUserPopBtn').html('סגור');
        $('#changeUserPopBtn').html('שנה שם');
        $('#changeNameDesc').html('שנה שם מ <span id="prevName"></span> ל <span id="nextName"></span>?');
        $('#noGenrePop h2').html('אין תוצאות');
        $('#noGenrePop .popupBtn').html('סגור');
        $('#genreDesc').html('אין סרטי <span id="pickedGenre"></span>');
        $('#genrePop h2').html(`בחר ג'אנר`);
        $('#genrePop .popupBtn').html('סגור');
        $('#noFavoritesPop h2').html('אין מועדפים');
        $('#noFavoritesPop p').html('הוסף / הוסיפי סרטים / סדרות לרשימת המועדפים');
        $('#noFavoritesPop .popupBtn').html('סגור');
        $('#allBtn').html('כל הסרטים');
        $('#actionBtn').html('אקשן');
        $('#adventureBtn').html('הרפתקאה');
        $('#animationBtn').html('אנימציה');
        $('#comedyBtn').html('קומדיה');
        $('#crimeBtn').html('פשע');
        $('#documentaryBtn').html('דוקו');
        $('#dramaBtn').html('דרמה');
        $('#familyBtn').html('משפחה');
        $('#fantasyBtn').html('פנטזיה');
        $('#historyBtn').html('היסטוריה');
        $('#horrorBtn').html('אימה');
        $('#musicBtn').html('מוסיקה');
        $('#mysteryBtn').html('מסתורין');
        $('#romanceBtn').html('רומנטיקה');
        $('#scienceFictionBtn').html('מדע בדיוני');
        $('#tVMovieFictionBtn').html('סרט טלוויזיוני');
        $('#thrillerBtn').html('מותחן');
        $('#warBtn').html('מלחמה');
        $('#westernBtn').html('מערבון');
        
        if (userLoggedIn) {  
            $('#usernameMenu').html('שלום, ' + "<span id='usernameSpan'>" + capitalize(currentUser.get("username")) + "</span>");
            $('#myAccountBtn').html('החשבון שלי');
            $('#favoritesBtn').html('מועדפים');
            $('#logoutBtn').html('התנתק/י');
        }

        if(!didChangeLang)  {
            setTimeout(() => {
                $('#hebrewLang').show();
            }, 1000)
            
            didChangeLang = true;
        }
    } else {
        lang = 'en-US';
        $('#usFlag').css({'pointer-events': 'none', 'opacity': '.5'});
        $('#isFlag').css({'pointer-events': 'all', 'opacity': '1'});
        $('#hebCss').remove();
        $('#searchMovie').attr('placeholder', 'Search a Movie, Person or TV Show');
        $('#switchContentBtn').html('Upcoming');
        $('#switchContentBtn2').html('Trending');
        $('#switchContentBtn3').html('Playing Now');
        $('#noInstagramPop h2').html('No Instagram Profile');
        $('#noImdbPop h2').html('No Imdb Profile');
        $('#changeUsernamePop h2').html('Username Change');
        $('#noInstagramPop .popupBtn').html('Close');
        $('#noImdbPop .popupBtn').html('Close');
        $('#closeUserPopBtn').html('Close');
        $('#changeUserPopBtn').html('Change Name');
        $('#changeNameDesc').html('Change Username From <span id="prevName"></span> To <span id="nextName"></span>?');
        $('#noGenrePop h2').html('No Results');
        $('#noGenrePop .popupBtn').html('Close');
        $('#genreDesc').html('No <span id="pickedGenre"></span> Movies');
        $('#genrePop h2').html('Pick A Genre');
        $('#genrePop .popupBtn').html('Close');
        $('#noFavoritesPop h2').html('No Favorites');
        $('#noFavoritesPop p').html('Add Some Favorites Movies / TV Shows To Your List');
        $('#noFavoritesPop .popupBtn').html('Close');
        $('#allBtn').html('All Movies');
        $('#actionBtn').html('Action');
        $('#adventureBtn').html('Adventure');
        $('#animationBtn').html('Animation');
        $('#comedyBtn').html('Comedy');
        $('#crimeBtn').html('Crime');
        $('#documentaryBtn').html('Documentary');
        $('#dramaBtn').html('Drama');
        $('#familyBtn').html('Family');
        $('#fantasyBtn').html('Fantasy');
        $('#historyBtn').html('History');
        $('#horrorBtn').html('Horror');
        $('#musicBtn').html('Music');
        $('#mysteryBtn').html('Mystery');
        $('#romanceBtn').html('Romance');
        $('#scienceFictionBtn').html('Science Fiction');
        $('#tVMovieFictionBtn').html('TV Movie');
        $('#thrillerBtn').html('Thriller');
        $('#warBtn').html('War');
        $('#westernBtn').html('Western');

        if (userLoggedIn) {  
            $('#usernameMenu').html('Hello, ' + "<span id='usernameSpan'>" + capitalize(currentUser.get("username")) + "</span>");
            $('#myAccountBtn').html('My Account');
            $('#favoritesBtn').html('Favorites');
            $('#logoutBtn').html('Logout');
        }
    }

    refreshFunctions();

    if (page == 0) {
        $('.movieWrapper').remove();
        $('#popularPeopleWrapper').empty().hide();
        getPlayingNow();
        $('#contentWrapper').css({'pointer-events': 'none', 'opacity': .5});
        $('html').css('overflow-y', 'hidden');  
        $('#spinner').fadeIn('fast');
    
        setTimeout(() => {
            $('#spinner').hide();
            $('#contentWrapper').css({'pointer-events': 'all', 'opacity': 1});
            $('html').css('overflow-y', 'unset'); 
            window.scrollTo(0, 1);

            if ($(window).width() > 765) {
                hoverEffect($('.movieWrapper'))
            }

        }, 1000); 
    } else {
        goHome();
    }
}