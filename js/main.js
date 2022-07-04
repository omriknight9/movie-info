
let movieId;
let tvShowId;
let imdbId;
let wrapper;
let title;
let originalTitle;
let valid;
let topTen;
let playingNow;
let monthName;
let dayName;
let date;
let arr = [];
let movieImage;
let objectImage;
let page;
let script;
let counter = 1;
let upcoming;
let personNames;
let didChangeLang = false;
let didPopularLoaded = false;
let didImagesLoaded = false;
let directorCounter = 0;
let darkMode = false;

let lang = 'en-US';

const regex = /^[אבגדהוזחטיכלמנסעפצקרשתץףךןם:!1234567890' ]+$/i;

let upcomingUrl;
let nowPlayingUrl;
let getTrendingUrl;
const tmdbKey = '0271448f9ff674b76c353775fa9e6a82';
const searchMovieUrl = "https://api.themoviedb.org/3/search/multi?api_key=" + tmdbKey + "&query=";
const imdb = 'https://www.imdb.com/title/';
const persnImdb = 'https://www.imdb.com/name/';
const youtubeVideo = 'https://www.youtube.com/embed/';
const movieInfoUrl = "https://api.themoviedb.org/3/movie/";
const movieActorsUrl = "https://api.themoviedb.org/3/person/";
const tvShowInfoUrl = "https://api.themoviedb.org/3/tv/";

$(document).ready(() => {

    $('#darkToggle').click(() => {

        $('#contentWrapper').css({'pointer-events': 'none', 'opacity': '.3'});

        if (!$('#darkToggle').hasClass('dark')) {
            darkMode = true;
            if (page == 3 || page == 5) {
                $('html, body').css({'background': 'url(./images/background.jpg) no-repeat center center fixed', 'background-size': 'cover'});
            } else {
                $('html, body').css({'background': '#323538'});
            }

            if (page == 1) {
                $('#descriptionArrow, .reviewArrow').attr('src', './images/arrowInverted.png');
            }

            $("head").append("<link rel='stylesheet' type='text/css' href='css/darkMode.css' id='darkCss'/>");
        } else {
            darkMode = false;
            if (page == 3 || page == 5) {
                $('html, body').css({'background': 'url(./images/background.jpg) no-repeat center center fixed', 'background-size': 'cover'});
            } else {
                $('html, body').css({'background': 'unset'});
            }

            if (page == 1) {
                $('#descriptionArrow, .reviewArrow').attr('src', './images/arrow.png');
            }

            $('#darkCss').remove();
        }
        
        $('#darkToggle').toggleClass('dark');

        setTimeout(() => {
            $('#contentWrapper').css({'pointer-events': 'all', 'opacity': '1'});
        }, 400)
    });

    let valToSend;
    let nameToSend;
    let fromMovieSite = false;

    refreshFunctions();

    if (window.location.href.indexOf("value=") > -1) {
        valToSend = window.location.href.split('value=')[1].split('&')[0];
    }

    if (window.location.href.indexOf("title=") > -1) {
        nameToSend = window.location.href.split('title=')[1].split('&')[0];
        nameToSend = nameToSend.split('%20').join(' ');
        fromMovieSite = true;
        objectClicked(valToSend, nameToSend.toString(), nameToSend.toString(), 1);
        $('html').css('overflow-y', 'unset');  
    } else {
        getPlayingNow();
        $('#contentWrapper').css({'pointer-events': 'none', 'opacity': '.5'});
        $('html').css('overflow-y', 'hidden');  
        $('#spinner').fadeIn('fast');

        var interval = setInterval(() => {
            if ($('.movieWrapper').length !== 0 && $('.movieWrapper').is(':visible')) {
                clearInterval(interval);
                $('html').css('overflow-y', 'unset'); 
                $('#contentWrapper').css({'pointer-events': 'all', 'opacity': 1});
                $('#spinner').hide();
                window.scrollTo(0, 1);

                if ($(window).width() > 765) {
                    hoverEffect($('.movieWrapper'))
                }
            }
        }, 400);
    }

    page = 0;

    let x = location.href;

    if (!fromMovieSite) {
        if (x.includes('?')) {
            location.href = x.split("?")[0];
        }
    }

    window.onscroll = () => {
        scrollIndicator();
        scrollBtn();
        lazyload();
        showPopular();
    };

    $('.Xbtn').click(function () {
        $(this).parent().parent().hide();
    })

    $('#searchMovie').on("keyup", (event) => {
        event.preventDefault();
    });

    showResults();
})

const hoverEffect = (object) => {
    if ($(window).width() > 765) {
        $(object).hover(
            function() {
                $(object).addClass('rest');
                $(this).addClass('chosenHover');
            }
          );

        $(object).hover(
            function() {

            }, function() {
                $(object).removeClass('rest');
                $(this).removeClass('chosenHover');
            }
        );
    }
}

const scrollIndicator = () => {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
}

const showPopular = () => {

    let length = $(document).height() - Number($(window).height() + 500);

    if ($(window).scrollTop() > length && $('.popularPerson').length == 0 && !$('.popularPerson').is(':visible') && page == 0 && !didPopularLoaded) {

        didPopularLoaded = true;

        $('#contentWrapper').css({'pointer-events': 'none', 'opacity': '.5'});
        $('#spinner').fadeIn('fast');

        getPopularPeople(1, 1);
        getPopularPeople(2, 2);

        document.querySelector('#captainmarvel').scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            $('#contentWrapper').css({'pointer-events': 'all', 'opacity': 1});
            $('#spinner').hide();
            if ($(window).width() > 765) {
                hoverEffect($('.popularPerson'))
            }

        }, 1000)
    }
}

const refreshFunctions = () => {  
    upcomingUrl = "https://api.themoviedb.org/3/movie/upcoming?api_key=" + tmdbKey + "&language=" + lang + "&page=";
    nowPlayingUrl = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + tmdbKey + "&language=" + lang + "&page=";
    getTrendingUrl = "https://api.themoviedb.org/3/trending/all/day?api_key=" + tmdbKey + "&language=" + lang + "&page=";
}

const changeLang = (langNum) => {

    if (langNum == 1) {
        $('#isFlag').css({'pointer-events': 'none', 'opacity': '.5'});
        $('#usFlag').css({'pointer-events': 'all', 'opacity': '1'});
        lang = 'he';

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
        $('#usFlag').css({'pointer-events': 'none', 'opacity': '.5'});
        $('#isFlag').css({'pointer-events': 'all', 'opacity': '1'});
        lang = 'en-US';

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

const lazyload = () => {

    let lazyloadImages = document.querySelectorAll(".lazy");

    let scrollTop = window.pageYOffset;

    lazyloadImages.forEach((img) => {
        if (img.getBoundingClientRect().top + 200 < (window.innerHeight)) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        }
    });
}

const switchContent = (type) => {

    window.onscroll = () => {
        scrollIndicator();
        scrollBtn();
        lazyload();
    };

    didPopularLoaded = false;

    $('#popularPeopleWrapper').empty().hide();
    
    $('.chosenMovieSection').empty();
    $('#chosenMovieTitle').remove();
    $('#container, #switchContentBtnWrapper, .bottomSection').hide();
    $('#spinner').fadeIn('fast');
    $('#contentWrapper').css({'pointer-events': 'none', 'opacity': '.5'});

    if (type == 1) {

        $('#switchContentBtn2, #switchContentBtn3').show();
        $('#switchContentBtn').hide();

        getUpcoming();

        setTimeout(() => {
            $('#container, #switchContentBtnWrapper').show();

            var interval = setInterval(() => {
                if ($('.movieWrapper').length !== 0 && $('.movieWrapper').is(':visible')) {
                    clearInterval(interval);
                    $('html').css('overflow-y', 'unset'); 
                    $('.bottomSection').show();
                    $('#contentWrapper').css({'pointer-events': 'all', 'opacity': 1});
                    $('#spinner').hide();
                    window.scrollTo(0, 1);

                    window.onscroll = () => {
                        scrollIndicator();
                        scrollBtn();
                        lazyload();
                        showPopular();
                    }
                }
            }, 400);

            if ($(window).width() > 765) {
                hoverEffect($('.movieWrapper'))
            }

        }, 1000)

    } else if(type == 2) {

        $('#switchContentBtn, #switchContentBtn2').show();
        $('#switchContentBtn3').hide();

        getPlayingNow();
        setTimeout(() => {

            $('#container, #switchContentBtnWrapper').show();

            var interval = setInterval(() => {
                if ($('.movieWrapper').length !== 0 && $('.movieWrapper').is(':visible')) {
                    clearInterval(interval);
                    $('html').css('overflow-y', 'unset'); 
                    $('.bottomSection').show();
                    $('#contentWrapper').css({'pointer-events': 'all', 'opacity': 1});
                    $('#spinner').hide();
                    window.scrollTo(0, 1);
                    window.onscroll = () => {
                        scrollIndicator();
                        scrollBtn();
                        lazyload();
                        showPopular();
                    }
                }
            }, 400);

            if ($(window).width() > 765) {
                hoverEffect($('.movieWrapper'))
            }
        }, 1000)

    } else if(type == 3) {
        $('.movieWrapper, .btnWrapper').remove();
        $('#switchContentBtn3, #switchContentBtn').show();
        $('#switchContentBtn2').hide();

        getTrendingObjects();

        setTimeout(() => {
            $('#container, #switchContentBtnWrapper').show();

            var interval = setInterval(() => {
                if ($('.movieWrapper').length !== 0 && $('.movieWrapper').is(':visible')) {
                    clearInterval(interval);
                    $('.bottomSection').show();
                    $('#contentWrapper').css({'pointer-events': 'all', 'opacity': 1});
                    $('#spinner').hide();
                    $('html').css('overflow-y', 'unset');
                    window.scrollTo(0, 1); 
                    window.onscroll = () => {
                        scrollIndicator();
                        scrollBtn();
                        lazyload();
                        showPopular();
                    }
                }
            }, 400);
            if ($(window).width() > 765) {
                hoverEffect($('.movieWrapper'))
            }
        }, 1000)
    }
}

const getTrendingObjects = () => {

    if (lang == 'he') {
        $('#currentHeader').html('טרנדי'); 
    } else {
        $('#currentHeader').html('Trending');
    }

    $('.btnWrapperPlayingNow').remove();

    let btnWrapper = $('<div>', {
        class: 'btnWrapper'
    }).appendTo('#switchContentBtnWrapper');

    let finalDateText;
    let finalNameText;

    if (lang == 'he') {
        finalDateText = 'סדר לפי תאריך';
        finalNameText = 'סדר לפי שם';
    } else {
        finalDateText = 'Sort By Date';
        finalNameText = 'Sort By Name';
    }

    let dateSortBtn = $('<button>', {
        class: 'dateSortBtn',
        text: finalDateText,
        click:() => {
            sortMovies('releaseDate', 1, 2);
        }
    }).appendTo(btnWrapper);

    let titleSortBtn = $('<button>', {
        class: 'titleSortBtn',
        text: finalNameText,
        click: () => {
            sortMovies('movieTitle', 2, 2);
        }
    }).appendTo(btnWrapper);

    let promise = new Promise((resolve, reject) => {
        resolve(getInfo(getTrendingUrl, 1, 3));
    })
    .then(() => {
        getInfo(getTrendingUrl, 2, 3);
    })
    .then(() => {
        getInfo(getTrendingUrl, 3, 3);
    })
    .then(() => {
        getInfo(getTrendingUrl, 4, 3);
    })
}

const getInfo = (chosenUrl, times, type) => {
    
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: chosenUrl + times,
        dataType: "json",
        success: (data) => {       

            if (type == 1) {
                let btnWrapper = $('<div>', {
                    class: 'btnWrapper btnWrapperPlayingNow'
                }).appendTo('#switchContentBtnWrapper');

                let finalDateText;
                let finalNameText;

                if (lang == 'he') {
                    $('#currentHeader').html('עכשיו בקולנוע'); 
                    finalDateText = 'סדר לפי תאריך';
                    finalNameText = 'סדר לפי שם';
                } else {
                    $('#currentHeader').html('Playing Now');
                    finalDateText = 'Sort By Date';
                    finalNameText = 'Sort By Name';
                }
            
                let dateSortBtn = $('<button>', {
                    class: 'dateSortBtn',
                    text: finalDateText,
                    click: () =>{
                        sortMovies('releaseDate', 1, 1);
                    }
                }).appendTo(btnWrapper);       

                let titleSortBtn = $('<button>', {
                    class: 'titleSortBtn',
                    text: finalNameText,
                    click: () => {
                        sortMovies('movieTitle', 2, 1)
                    }
                }).appendTo(btnWrapper);

                let genreSortBtn = $('<i>', {
                    class: 'fas fa-window-restore',
                    id: 'genreSortBtn',
                    click: () => {
                        $('#genrePop').show();
                    }
                }).appendTo(btnWrapper);
            }

            let results = data.results;

            let todayDate = new Date();
            
            for (let i = 0; i < results.length; i++) {

                if (results[i].media_type == 'movie' || results[i].media_type == 'tv' || chosenUrl == nowPlayingUrl || chosenUrl == upcomingUrl) {

                    let finalDateForShow;
                    
                    if (results[i].media_type == 'tv') {
                        finalDateForShow = results[i].first_air_date;
                    } else {
                        finalDateForShow = results[i].release_date;
                    }

                    results[i].vote_average = JSON.stringify(results[i].vote_average);

                    let finalVoteText;

                    if ((results[i].vote_average.length == 1 && results[i].vote_average !== '0') || results[i].vote_average == '10') {
                        finalVoteText = results[i].vote_average + '0'
                    } else {
                        finalVoteText = results[i].vote_average;
                    }

                    finalVoteText = finalVoteText.replace('.', '') + '%';

                    if (finalVoteText == '0%' && JSON.stringify(finalDateForShow > todayDate)) {
                        finalVoteText = 'TBD';
                    }

                    let path = results[i].poster_path;

                    if (results[i].media_type == 'movie') {
                        title = results[i].title;
                    } else if(results[i].media_type == 'tv') {
                        title = results[i].name;
                    } else {
                        title = results[i].title;
                    }

                    if (results[i].media_type == 'movie') {
                        originalTitle = results[i].original_title;
                    } else if(results[i].media_type == 'tv') {
                        originalTitle = results[i].original_name;
                    } else {
                        originalTitle = results[i].original_title;
                    }

                    movieImage = results[i].backdrop_path;
                    movieId = results[i].id;
                    let tmdbPathPosterPath = 'https://image.tmdb.org/t/p/w1280' + path;
                    let tmbdBackdropPath = 'https://image.tmdb.org/t/p/w1280' + movieImage;

                    let finalDate;

                    if (finalDateForShow == '') {
                        finalDate = 'No Release Date';
                    } else {
                        let readDate = new Date(finalDateForShow);
                        let finalMonth = readDate.getMonth() + 1;
                        let finalDay = readDate.getDate();
            
                        if (lang == 'he') {
                            changeMonthNameHeb(finalMonth - 1, 2);
                            changeDayNameHeb(finalDay);
                        } else {
                            changeMonthName(finalMonth - 1, 2);
                            changeDayName(finalDay);
                        }

                        finalDate = monthName + ' ' + dayName + ' ' + readDate.getFullYear(); 
                    }

                    if (path == 'undefined' || path == null) {
                        tmdbPathPosterPath = './images/stock.png';
                    }

                    let movieDate = new Date(JSON.stringify(finalDateForShow));

                    let genreArr = results[i].genre_ids;

                    if (type == 2 && movieDate > todayDate || type !== 2) {
                        wrapper = $('<div>', {
                            class: 'movieWrapper',
                            value: movieId,
                            backdropSrc: tmbdBackdropPath,
                            releaseDate: finalDateForShow,
                            movieTitle: title,
                            genres: genreArr,
                            originalTitle: originalTitle,
                            popularity: results[i].popularity,
                        }).appendTo($('#container'));

                        if (userLoggedIn && results[i].media_type !== 'person') {   

                            let finalTypeToAdd;

                            if (results[i].media_type == 'tv') {
                                finalTypeToAdd = 2;
                            } else { 
                                finalTypeToAdd = 1;
                            }

                            let addToFavoritesBtn = $('<img>', {
                                class: 'addToFavoritesBtn',
                                src: './images/emptyStar.png',
                                alt: 'star',
                                click: function() {
                                    if ($(this).attr('src') == './images/emptyStar.png') {
                                        $(this).attr('src', './images/fullStar.png');
                                    } else {
                                        $(this).attr('src', './images/emptyStar.png');
                                    }
    
                                    addToFavorites(Number($(this).parent().attr('value')), finalTypeToAdd);
                                }
                            }).appendTo($(wrapper));
    
                            let cleanVal = $(wrapper).attr('value');
                            let finalObjectArr;

                            if (type == 3 && results[i].media_type == 'tv') {
                                finalObjectArr = chosenTvShowsArr;
                            } else {
                                finalObjectArr = chosenMoviesArr;
                            }
            
                            if (finalObjectArr.includes(Number(cleanVal))) {
                                let starBtn = $(wrapper).find($('.addToFavoritesBtn'));
                                $(starBtn).attr('src', './images/fullStar.png');
                            }
                        }
    
                        let finalName;
    
                        if (title.length > 40) {
                            finalName = title.substring(40, 0) + '...';
                            $(wrapper).addClass('longNameWrapper');
                        } else {
                            finalName = title;
                        }
    
                        let movieTitle = $('<p>', {
                            class: 'movieTitle',
                            text: finalName
                        }).appendTo(wrapper);

                        if (lang == 'he' && regex.test($(movieTitle).html())) {
                            $(movieTitle).addClass('hebTitle');
                        }  
    
                        if ($(wrapper).hasClass('longNameWrapper')) {
                            $(movieTitle).addClass('longName');
                
                            let movieFullNameWrapper = $('<div>', {
                                class: 'movieFullNameWrapper',
                            }).appendTo(wrapper);
                
                            let movieFullName = $('<p>', {
                                class: 'movieFullName',
                                text: title
                            }).appendTo(movieFullNameWrapper);
                
                            if ($(window).width() > 765) {
                                $('.longName').hover(
                                    function() {
                                        $('.btnWrapper').css('opacity', '0');
                                        $(this).css('opacity', '.5');
                                        $(this).parent().find('.movieFullNameWrapper').fadeIn();
                                    }
                                );
                
                                $(wrapper).hover(
                                    function() {
                
                                    }, function() {
                                        $(this).find($('.longName')).css('opacity', '1');
                                        setTimeout(() => {
                                            $('.btnWrapper').css('opacity', '1');
                                        }, 200)
                                        $(this).find($('.longName')).css('opacity', '1');
                                        $(this).find('.movieFullNameWrapper').fadeOut();
                                    }
                                );
                            }   
                        }
    
                        let imgDateWrapper = $('<div>', {
                            class: 'imgDateWrapper',
                            click: function () {
                                $('#chosenMovie .addToFavoritesBtn, #chosenMovieTitle, .movieWrapper, #socialLinksWrapper, .creditsHeader').remove();
                                $('#popularPeopleWrapper').empty().hide();
                                $('.chosenMovieSection').empty();
                                $('#results').fadeOut('fast');
                                $('#searchMovie').val('');
                                $('.btnWrapper').hide();
                                
                                if (results[i].media_type == 'tv') {
                                    objectClicked($(this).parent().attr('value'), $(this).parent().attr('movieTitle').toString(), $(this).parent().attr('originalTitle').toString(), 2);
                                } else {
                                    objectClicked($(this).parent().attr('value'), $(this).parent().attr('movieTitle').toString(), $(this).parent().attr('originalTitle').toString(), 1);
                                }
                            },
                        }).appendTo(wrapper);
    
                        if (finalVoteText !== 'TBD') {

                            let voteWrapper = $('<div>', {
                                class: 'voteWrapper',
                            }).appendTo(imgDateWrapper);

                            let voteBackground = $('<span>', {
                                class: 'voteBackground',
                                voteCount: finalVoteText.replace('%', '')
                            }).appendTo(voteWrapper);

                            
                            let voteTextContent = $('<div>', {
                                class: 'voteTextContent',
                            }).appendTo(voteWrapper);

                            let vote = $('<span>', {
                                class: 'vote',
                                text: finalVoteText
                            }).appendTo(voteTextContent);
                        }
    
                        let movieDate = $('<p>', {
                            class: 'movieDate',
                            text: finalDate
                        }).appendTo(imgDateWrapper);
    
                        let img = $('<img>', {
                            class: 'movieImg lazy',
                            alt: 'movieImg',
                            'data-src': tmdbPathPosterPath,
                            'src': './images/stock.png'
                        }).appendTo(imgDateWrapper);
                    }
                }    
            }

            setTimeout(() => {
                $.each($('.voteBackground'), (key, value) => {
                    let height = $(value).attr('voteCount');
                    $(value).css('height', height + '%');

                    var r = height < 70 ? 255 : Math.floor(255-(height*2-100)*255/100);
                    var g = height >= 70 ? 255 : Math.floor((height*2)*255/100);

                    if (height > 45 && height < 70) {
                        g = g - 100;
                    } else if(height >= 70) {
                        g = g - 50;
                    } else {
                        g = g;
                    }

                    $(value).css('background-color', 'rgb('+r+','+g+',0)');          
                });
            }, 500)
        },

        error: (err) => {
            //console.log(err);
        }
    })

    setTimeout(() => {
        sortResults($('#container'), 'popularity', 2);
    }, 1000);
}

const pickGenre = (pickedGenre) => {

    $('#genrePop').hide();
    
    let genreResults = 0;

    $('.movieWrapper').hide();

    $.each($('.movieWrapper'), (key, value) => {
        let genres = $(value).attr('genres');

        var newArr = genres.split(',');

        for (let i = 0; i < newArr.length; i++) {

            if (Number(newArr[i]) == pickedGenre) {
                genreResults++;
                $(value).show();
            }
        }   
    });

    setTimeout(() => {
        if (genreResults == 0) {
            let finalGenreText;
            switch(pickedGenre) {
                case 999:
                    $('.movieWrapper').show();
                    return false;
                case 28:
                    if (lang == 'he') {
                        finalGenreText = 'אקשן'; 
                    } else {
                        finalGenreText = 'Action';
                    }
                    break;
                case 12:
                    if (lang == 'he') {
                        finalGenreText = 'הרפתקאה'; 
                    } else {
                        finalGenreText = 'Adventure';
                    }
                    break;
                case 16:
                    if (lang == 'he') {
                        finalGenreText = 'אנימציה'; 
                    } else {
                        finalGenreText = 'Animation';
                    }
                    break;
                case 35:
                    if (lang == 'he') {
                        finalGenreText = 'קומדיה'; 
                    } else {
                        finalGenreText = 'Comedy';
                    }
                    break;
                case 80:
                    if (lang == 'he') {
                        finalGenreText = 'פשע'; 
                    } else {
                        finalGenreText = 'Crime';
                    }
                    break;
                case 99:
                    if (lang == 'he') {
                        finalGenreText = 'דוקו'; 
                    } else {
                        finalGenreText = 'Documentary';
                    }
                    break;
                case 18:
                    if (lang == 'he') {
                        finalGenreText = 'דרמה'; 
                    } else {
                        finalGenreText = 'Drama';
                    }
                    break;
                case 10751:
                    if (lang == 'he') {
                        finalGenreText = 'משפחה'; 
                    } else {
                        finalGenreText = 'Family';
                    }
                    break;
                case 14:
                    if (lang == 'he') {
                        finalGenreText = 'פנטזיה'; 
                    } else {
                        finalGenreText = 'Fantasy';
                    }
                    break;
                case 36:
                    if (lang == 'he') {
                        finalGenreText = 'היסטוריה'; 
                    } else {
                        finalGenreText = 'History';
                    }
                    break;
                case 27:
                    if (lang == 'he') {
                        finalGenreText = 'אימה'; 
                    } else {
                        finalGenreText = 'Horror';
                    }
                    break;
                case 10402:
                    if (lang == 'he') {
                        finalGenreText = 'מוסיקה'; 
                    } else {
                        finalGenreText = 'Music';
                    }
                    break;
                case 9648:
                    if (lang == 'he') {
                        finalGenreText = 'מסתורין'; 
                    } else {
                        finalGenreText = 'Mystery';
                    }
                    break;
                case 10749:
                    if (lang == 'he') {
                        finalGenreText = 'רומנטיקה'; 
                    } else {
                        finalGenreText = 'Romance';
                    }
                    break;
                case 878:
                    if (lang == 'he') {
                        finalGenreText = 'מדע בדיוני'; 
                    } else {
                        finalGenreText = 'Science Fiction';
                    }
                    break;
                case 10770:
                    if (lang == 'he') {
                        finalGenreText = 'סרט טלוויזיוני'; 
                    } else {
                        finalGenreText = 'TV Movie';
                    }
                    break;
                case 53:
                    if (lang == 'he') {
                        finalGenreText = 'מותחן'; 
                    } else {
                        finalGenreText = 'Thriller';
                    }
                    break;
                case 10752:
                    if (lang == 'he') {
                        finalGenreText = 'מלחמה'; 
                    } else {
                        finalGenreText = 'War';
                    }
                    break;
                case 37:
                    if (lang == 'he') {
                        finalGenreText = 'מערבון'; 
                    } else {
                        finalGenreText = 'Western';
                    }
                    break;
            }
            $('#pickedGenre').html(finalGenreText);
            $('#noGenrePop').show();
            $('.movieWrapper').show();
        }
    }, 500);
}

const getUpcomingMovies = (type, times) => {
    $('.movieWrapper, .btnWrapperPlayingNow').remove();

    if (type == 1) {
        $('.btnWrapper').remove();

        let btnWrapper = $('<div>', {
            class: 'btnWrapper btnWrapperUpcoming'
        }).appendTo('#switchContentBtnWrapper');

        let finalDateText;
        let finalNameText;

        if (lang == 'he') {
            $('#currentHeader').html('בקרוב'); 
            finalDateText = 'סדר לפי תאריך';
            finalNameText = 'סדר לפי שם';
        } else {
            $('#currentHeader').html('Upcoming Movies');
            finalDateText = 'Sort By Date';
            finalNameText = 'Sort By Name';
        }

        let dateSortBtn = $('<button>', {
            class: 'dateSortBtn',
            text: finalDateText,
            click: () => {
                sortMovies('releaseDate', 1, 2);
            }
        }).appendTo(btnWrapper);

        let titleSortBtn = $('<button>', {
            class: 'titleSortBtn',
            text: finalNameText,
            click: () => {
                sortMovies('movieTitle', 2, 2);
            }
        }).appendTo(btnWrapper);

        let genreSortBtn = $('<i>', {
            class: 'fas fa-window-restore',
            id: 'genreSortBtn',
            click: () => {
                $('#genrePop').show();
            }
        }).appendTo(btnWrapper);
    }

    getInfo(upcomingUrl, times, 2);

    setTimeout(() => {
        sortResults($('#container'), 'popularity', 2);
    }, 500);
}

const getPopularPeople = (type, times) => {
    if (type == 1) {    
        $('#popularPeopleWrapper').empty().hide();
    }

    let finalUrl;

    if (type == 1) {
        finalUrl = "https://api.themoviedb.org/3/person/popular?api_key=" + tmdbKey + '&language=' + lang;
    } else {
        finalUrl = "https://api.themoviedb.org/3/person/popular?api_key=" + tmdbKey + '&language=' + lang + '&page=' + times; 
    }

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: finalUrl,
        dataType: "json",
        success: (data) => {

            $('#popularPeopleWrapper').show();

            if (type == 1) {

                let finalHeaderText;

                if (lang == 'he') {
                    finalHeaderText = 'אנשים פופולרים';
                } else {
                    finalHeaderText = 'Popular People';
                }
    
                let popularPeopleHeader = $('<h2>', {
                    id: 'popularPeopleHeader',
                    text: finalHeaderText
                }).appendTo(popularPeopleWrapper); 
            }

            for (let i = 0; i < data.results.length; i++) {
                
                let popularPerson = $('<div>', {
                    class: 'popularPerson',
                    name: data.results[i].name,
                    value: data.results[i].id,
                    popularity: data.results[i].popularity,
                    click: function() {
                        $('#chosenMovie .addToFavoritesBtn, #chosenMovieTitle, .movieWrapper, #socialLinksWrapper, .creditsHeader').remove();
                        $('#popularPeopleWrapper').empty().hide();
                        $('.chosenMovieSection').empty();
                        $('#results').fadeOut('fast');
                        $('#searchMovie').val('');
                        $('.btnWrapper').hide();
                        objectClicked($(this).attr('value'), $(this).attr('name').toString(), $(this).attr('name').toString(), 3);
                    }
                }).appendTo($('#popularPeopleWrapper'));

                let popularPersonName = $('<p>', {
                    class: 'popularPersonName',
                    text: data.results[i].name,
                }).appendTo(popularPerson);

                let finalPersonImg;

                if (data.results[i].profile_path == null || data.results[i].profile_path == '') {
                    finalPersonImg = './images/oscar.jpg';
                } else {
                    finalPersonImg = 'https://image.tmdb.org/t/p/w1280' + data.results[i].profile_path;
                }

                let popularPersonImg = $('<img>', {
                    class: 'popularPersonImg lazy',
                    alt: 'Person Img',
                    'data-src': finalPersonImg,
                    src: './images/stock.png',
                }).appendTo(popularPerson);
            }

            if (type == 2) {
                setTimeout(() => {
                    sortPopularMovies($('#popularPeopleWrapper'), 'popularity', 3);
                }, 1000);
            }
        },
        error: (err) => {
            //console.log(err);
        }
    })
}

async function getUpcoming() {

    $('#contentWrapper').css({'pointer-events': 'none', 'opacity': '.5'});

    let promise = new Promise((resolve, reject) => {
        resolve(getUpcomingMovies(1, ''));
    });
    
    let promise2 = new Promise((resolve, reject) => {
        getUpcomingMovies(2, 2);
    });

    let promise3 = new Promise((resolve, reject) => {
        getUpcomingMovies(2, 3);
    });

    let promise4 = new Promise((resolve, reject) => {
        getUpcomingMovies(2, 4);
    });

    await Promise.all([promise, promise2, promise3, promise4]);
}

const showResults = () => {
    $(document).mouseup((e) => {
        let container = $('#results');

        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
        }
    });

    $('#searchMovie').on('keyup', () => {
        $('#results').empty();
        let cleanInput = $('#searchMovie').val();

        if (cleanInput.length === 0) {
            $('#results').html('');
            $('#results').hide();
        }

        if (cleanInput.length > 0) {
            if (darkMode) {
                $('#searchMovie').css('color', 'white'); 
            } else {
                $('#searchMovie').css('color', 'black');
            }

            let queryUrl = searchMovieUrl + cleanInput + '&language=' + lang;

            let ajax2 = $.ajax({
                url: queryUrl,
                dataType: 'json',
                jsonp: false,
                success: (result) => {

                    let todayDate = new Date();

                    if (result == 'undefind' || result == null) {
                        return;
                    }

                    if (result.length > 0) {
                        $('#results').html('');
                        $('#results').hide();
                    }

                    $('#results').show();
                    $('#results').animate({ scrollTop: 0 }, 'fast');

                    for (let i = 0; i < result.results.length; i++) {

                        if (result.results[i].media_type !== 'person') {
                            let finalTitle;
                            let finalOriginalTitle;

                            if (result.results[i].media_type == 'tv') {
                                finalTitle = result.results[i].name;
                                finalOriginalTitle = result.results[i].original_name;
                            } else if (result.results[i].media_type == 'movie') {
                                finalTitle = result.results[i].title;
                                finalOriginalTitle = result.results[i].original_title;
                            }
    
                            let finalDate;
                            let readDate;
    
                            if (result.results[i].media_type == 'tv') {
                                readDate = new Date(result.results[i].first_air_date);
                            } else if (result.results[i].media_type == 'movie') {
                                readDate = new Date(result.results[i].release_date);
                            }
    
                            let finalMonth = readDate.getMonth() + 1;
                            let finalDay = readDate.getDate();

                            if (lang == 'he') {
                                changeMonthNameHeb(finalMonth - 1, 2);
                                changeDayNameHeb(finalDay);
                            } else {
                                changeMonthName(finalMonth - 1, 2);
                                changeDayName(finalDay);
                            }
        
                            finalDate = monthName + ' ' + dayName + ' ' + readDate.getFullYear(); 

                            let finalReleaseDate;

                            if (result.results[i].media_type == 'tv') {
                                finalReleaseDate = result.results[i].first_air_date;
                            } else if (result.results[i].media_type == 'movie') {
                                finalReleaseDate = result.results[i].release_date;
                            }
    
                            result.results[i].vote_average = JSON.stringify(result.results[i].vote_average);

                            let finalVoteText;
        
                            if ((result.results[i].vote_average.length == 1 && result.results[i].vote_average !== '0') || result.results[i].vote_average == '10') {
                                finalVoteText = result.results[i].vote_average + '0'
                            } else {
                                finalVoteText = result.results[i].vote_average;
                            }
        
                            finalVoteText = finalVoteText.replace('.', '') + '%';
                            
                            if (finalVoteText == '0%' && JSON.stringify(finalReleaseDate > todayDate)) {
                                finalVoteText = 'TBD';
                            }
    
                            let posterUrl;
    
                            if (result.results[i].poster_path == null) {
                                posterUrl = './images/noImage.png';
                            } else {
                                posterUrl = 'https://image.tmdb.org/t/p/w1280' + result.results[i].poster_path
                            }
    
                            let resultWrapper = $('<div>', {
                                class: 'resultRow',
                                popularity: result.results[i].popularity,
                                name: finalTitle,
                                originalTitle: finalOriginalTitle,
                                id: result.results[i].id,
                                type: result.results[i].media_type,
                                click: function() {
                                    $('#chosenMovie .addToFavoritesBtn, #chosenMovieTitle, .movieWrapper, #socialLinksWrapper, .creditsHeader').remove();
                                    $('#popularPeopleWrapper').empty().hide();
                                    $('.chosenMovieSection').empty();
                                    $('#results').fadeOut('fast');
                                    $('#searchMovie').val('');
                                    $('.btnWrapper').hide();
                                    
                                    if ($(this).attr('type') == 'tv') {
                                        objectClicked($(this).attr('id'), $(this).attr('name').toString(), $(this).attr('originalTitle').toString(), 2);
                                    } else {
                                        objectClicked($(this).attr('id'), $(this).attr('name').toString(), $(this).attr('originalTitle').toString(), 1);
                                    }
                                }
                            }).appendTo($('#results'));
    
                            let posterWrapper = $('<div>', {
                                class: 'posterWrapper'
                            }).appendTo(resultWrapper);
    
                            let poster = $('<img>', {
                                class: 'poster',
                                alt: 'poster',
                                src: posterUrl
                            }).appendTo(posterWrapper);
    
                            let movieDescription = $('<div>', {
                                class: 'description'
                            }).appendTo(resultWrapper);
    
                            let resultMovieTitle = $('<p>', {
                                class: 'resultMovieTitle',
                                text: finalTitle
                            }).appendTo(movieDescription);

                            if (lang == 'he' && regex.test($(resultMovieTitle).html())) {
                                $(resultMovieTitle).addClass('hebTitle');
                            }

                            let voteWrapper = $('<div>', {
                                class: 'searchStarImg',
                            }).appendTo(resultWrapper);

                            let searchVoteBackground = $('<span>', {
                                class: 'searchVoteBackground',
                                voteCount: finalVoteText.replace('%', '')
                            }).appendTo(voteWrapper);
                            
                            let voteTextContent = $('<div>', {
                                class: 'searchVoteTextContent',
                            }).appendTo(voteWrapper);

                            let vote = $('<span>', {
                                class: 'voteSearch',
                                text: finalVoteText
                            }).appendTo(voteTextContent);
                            
                            if ((result.results[i].release_date !== null && result.results[i].release_date !== 'undefined' && result.results[i].release_date !== undefined &&
                            result.results[i].release_date !== '') || (result.results[i].first_air_date !== null && result.results[i].first_air_date !== 'undefined' &&
                            result.results[i].first_air_date !== undefined && result.results[i].first_air_date !== '')) {
                                let resultMovieDate = $('<p>', {
                                    class: 'resultMovieDate',
                                    text: finalDate
                                }).appendTo(movieDescription);   
                            }
                        } else {

                            result.results[i].popularity = Math.floor(Number(result.results[i].popularity.toFixed(1)));
                            result.results[i].popularity = JSON.stringify(result.results[i].popularity);

                            let finalVoteText;
        
                            if ((result.results[i].popularity.length == 1 && result.results[i].popularity !== '0') || result.results[i].popularity == '10') {
                                finalVoteText = result.results[i].popularity + '0'
                            } else {
                                finalVoteText = result.results[i].popularity;
                            }
        
                            finalVoteText = finalVoteText.replace('.', '') + '%';

                            let finalTitle = result.results[i].name;
                        
                            let posterUrl;
    
                            if (result.results[i].profile_path == null) {
                                posterUrl = './images/noImage.png';
                            } else {
                                posterUrl = 'https://image.tmdb.org/t/p/w1280' + result.results[i].profile_path
                            }

                            let resultWrapper = $('<div>', {
                                class: 'resultRow',
                                popularity: result.results[i].popularity,
                                name: finalTitle,
                                id: result.results[i].id,
                                type: result.results[i].media_type,
                                click: function() {
                                    $('#chosenMovie .addToFavoritesBtn, #chosenMovieTitle, .movieWrapper, #socialLinksWrapper, .creditsHeader').remove();
                                    $('#popularPeopleWrapper').empty().hide();
                                    $('.chosenMovieSection').empty();
                                    $('#results').fadeOut('fast');
                                    $('#searchMovie').val('');
                                    $('.btnWrapper').hide();
                                    
                                    objectClicked($(this).attr('id'), $(this).attr('name').toString(), $(this).attr('name').toString(), 3);
                                }
                            }).appendTo($('#results'));

                            let posterWrapper = $('<div>', {
                                class: 'posterWrapper'
                            }).appendTo(resultWrapper);

                            let poster = $('<img>', {
                                class: 'poster',
                                alt: 'poster',
                                src: posterUrl
                            }).appendTo(posterWrapper);

                            let movieDescription = $('<div>', {
                                class: 'description'
                            }).appendTo(resultWrapper);
    
                            let resultMovieTitle = $('<p>', {
                                class: 'resultMovieTitle',
                                text: finalTitle
                            }).appendTo(movieDescription);

                            let voteWrapper = $('<div>', {
                                class: 'searchStarImg',
                            }).appendTo(resultWrapper);

                            let searchVoteBackground = $('<span>', {
                                class: 'searchVoteBackground',
                                voteCount: finalVoteText.replace('%', '')
                            }).appendTo(voteWrapper);
                            
                            let voteTextContent = $('<div>', {
                                class: 'searchVoteTextContent',
                            }).appendTo(voteWrapper);

                            let vote = $('<span>', {
                                class: 'voteSearch',
                                text: finalVoteText
                            }).appendTo(voteTextContent);
                        }
                    }

                    setTimeout(() => {
                        $.each($('.searchVoteBackground'), (key, value) => {

                            let height = $(value).attr('voteCount');
                            $(value).css('height', height + '%');
        
                            var r = height < 70 ? 255 : Math.floor(255-(height*2-100)*255/100);
                            var g = height >= 70 ? 255 : Math.floor((height*2)*255/100);     
                            
                            if (height > 45 && height < 70) {
                                g = g - 100;
                            } else if(height >= 70) {
                                g = g - 50;
                            } else {
                                g = g;
                            }
        
                            $(value).css('background-color', 'rgb('+r+','+g+',0)');            
                        });
                    }, 200)
                }
            })
        }

        setTimeout(() => {
            sortResults($('#results'), 'popularity', 1);
        }, 500);
    })
}

const sortPopularMovies = (container, elem1, type) => {
    let children;
    $.each($(container), function (key, value) {

        let ids = [], obj, i, len;

        switch(type) {
            case 1:
                children = $(this).find('.creditName');
                break;
            case 2: 
                children = $(this).find('.similarMovie');
                break;
            case 3: 
                children = $(this).find('.popularPerson');
                break;
            case 4: 
                children = $(this).find('.actorMovie');
                break;
        }

        for (i = 0, len = children.length; i < len; i++) {

            obj = {};
            obj.element = children[i];
            let elem2 = $(children[i]).attr(elem1);
			obj.idNum = elem2;
            ids.push(obj);
        }

        ids.sort(function (a, b) { return (b.idNum - a.idNum); });

        for (i = 0; i < ids.length; i++) {
            $(this).append(ids[i].element);
        }
    });
}

const sortResults = (container, elem1, type) => {

    let children;
    $.each($(container), function (key, value) {

        let ids = [], obj, i, len;

        if (type == 1) {
            children = $(this).find('.resultRow'); 
        } else {
            children = $(this).find('.movieWrapper');
        }

        for (i = 0, len = children.length; i < len; i++) {

            obj = {};
            obj.element = children[i];
            let elem2 = $(children[i]).attr(elem1);
			obj.idNum = elem2;
            ids.push(obj);
        }

        ids.sort(function (a, b) { return (b.idNum - a.idNum); });

        for (i = 0; i < ids.length; i++) {
            $(this).append(ids[i].element);
        }
    });

    if (type == 1) {
        $.each($('.resultRow'), (key, value) => {
            if ($('.resultRow[id="' + $(value).attr('id') + '"]').length > 1) {
                $('.resultRow[id="' + $(value).attr('id') + '"]')[0].remove();
            }
        });
    }
}

const getPlayingNow = () => {

    $('.movieWrapper, .btnWrapper').remove();

    getInfo(nowPlayingUrl, 1, 1);
}

const sortMovies = (elem1, kind, type) => {

    didPopularLoaded = false;

    $('#popularPeopleWrapper').empty().hide();

    $.each($('#container'), function (key, value) {
        let ids = [], obj, i, len;
        let children;
        if (type == 1) {
            children = $(this).find('.movieWrapper');
        } else if(type == 2) {
            children = $(this).find('.movieWrapper');
        } else if(type == 3) {
            children = $(this).find('.favoriteWrapper');
        }

        for (i = 0, len = children.length; i < len; i++) {
            obj = {};
            obj.element = children[i];
            let elem2 = $(children[i]).attr(elem1);
            switch (kind) {
                case 1:
                    obj.idNum = new Date(elem2);
                    break;
                case 2:
                    obj.idNum = elem2;
                    break;
                case 3:
                    obj.idNum = parseInt(elem2.replace(/[^\d]/g, ""), 10);
                    break;
            }
            ids.push(obj);
        }

        switch (kind) {
            case 1:
                switch (counter) {
                    case 1:
                        ids.sort((a, b) => { return (b.idNum - a.idNum); });
                        counter = 2;
                        break;
                    case 2:
                        ids.sort((a, b) => { return (a.idNum - b.idNum); });
                        counter = 1;
                        break;
                }
                break;
            case 2:
                switch (counter) {
                    case 1:
                        ids.sort((a, b) => {
                            return a.idNum.localeCompare(b.idNum);
                        });

                        counter = 2;
                        break;

                    case 2:
                        ids.sort((a, b) => {
                            return b.idNum.localeCompare(a.idNum);
                        });
                        counter = 1;
                        break;
                }
                $('.btnWrapper').attr('kind', kind);
                $('.groupSortBtn').css('pointer-events', 'all');
                break;
        }

        for (i = 0; i < ids.length; i++) {
            $(this).append(ids[i].element);
        }
    });

    $('.sortContainer').fadeOut('fast');
}

const goHome = () => {

    window.onscroll = () => {
        scrollIndicator();
        scrollBtn();
        lazyload();
        showPopular();
    };

    $('#socialLinksWrapper, #chosenMovie .addToFavoritesBtn, .creditsHeader').remove();

    $('#chosenMovie').attr('chosenId', '');

    if(userLoggedIn) {
        $('#user').hide();
        $('#menuOpenWrapper').show();
    } else {
        $('#user').show();
        $('#menuOpenWrapper').hide();
    }

    switch (page) {
        case 3:
            $('.favoriteWrapper').remove();
            $('#userWrapper').empty().hide();
            $('#searchBox, #switchContentBtnWrapper, .inputWrapper').show();
            break;
        case 4:
            $('.favoriteWrapper, .btnWrapperFavorites').remove();
            $('.chosenMovieSection').empty();
            $('#searchBox, #switchContentBtnWrapper, .inputWrapper').show();
            break;
        case 5:
            $('.favoriteWrapper, .btnWrapperFavorites').remove();
            $('#myAccountWrapper').empty().hide();
            $('.chosenMovieSection').empty();
            $('#searchBox, #switchContentBtnWrapper, .inputWrapper').show();
            break;
    }

    if (page !== 0) {
        $('#chosenMovieTitle').remove();
        $('#popularPeopleWrapper').empty().hide();
        $('#switchContentBtn').show();
        $('.chosenMovieSection').empty();
        $('#chosenMovie').hide();
        $('#container').removeClass('singleMovieContainer');
        $('#searchMovie').val('');
        $('.logo').css('cursor', 'auto');
        switchContent(2);
        window.history.pushState({ "html": location.href, "pageTitle": location.href.pageTitle }, "", location.href.split("?")[0]);
        if (darkMode) {
            $('html, body').css({'background': '#323538'});
        } else {
            $('html, body').css({'background': 'unset'});
        }

        page = 0;
    }
}

const getPersonInfo = (personId, personName) => {

    url = personName.replace(/[^A-Za-z0-9]+/g, "");

    window.history.pushState('page2', 'Title', '?' + url);
    window.addEventListener('popstate', (event) => {
        window.location.reload();
    });

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieActorsUrl + personId + "?api_key=" + tmdbKey + "&language=" + lang,
        dataType: "json",
        success: (data) => {

            personNames = [];

            personNames.push(data.also_known_as);

            page = 1;

            $('.logo').css('cursor', 'pointer');

            let finalObjectImage;

            if (data.profile_path == null || data.profile_path == '') {
                finalObjectImage = './images/oscar.jpg';
            } else {
                finalObjectImage = 'https://image.tmdb.org/t/p/w1280' + data.profile_path;
            }

            let detailsWrapper = $('<div>', {
                class: 'detailsWrapper',
            }).appendTo($('#detailsWrapper'));

            if (data.imdb_id !== '' && data.imdb_id !== null) {
                imdbId = data.imdb_id;

                let imdbLink = $('<a>', {
                    class: 'imdbLink',
                    target: '_blank',
                    rel: 'noopener',
                    href: persnImdb + imdbId
                }).appendTo(detailsWrapper);

                let imdbImage = $('<img>', {
                    class: 'personImdbImage',
                    src: finalObjectImage,
                    alt: 'imdbImage',
                }).appendTo(imdbLink);

            } else {
                let imdbLink = $('<a>', {
                    class: 'imdbLink',
                }).appendTo(detailsWrapper);

                let imdbImage = $('<img>', {
                    class: 'personImdbImage noImdbLink',
                    src: finalObjectImage,
                    alt: 'imdbImage',
                }).appendTo(imdbLink);
            }

            if (data.birthday == null && data.deathday == null && data.homepage == null && data.place_of_birth == null) {
                
            } else {
                let personDetailWrapper = $('<div>', {
                    id: 'personDetailWrapper',
                }).appendTo(detailsWrapper);

                if (data.birthday !== null) {

                    let date = new Date(data.birthday);
                    let day = date.getDate();
                    let month = date.getMonth() + 1;
                    let yearToShow = date.getFullYear();

                    let finalBirthText;
                    let finalAgeText;
                    let finalAge = getAge(data.birthday, 1);

                    if (lang == 'he') {
                        changeMonthNameHeb(month - 1, 1);
                        changeDayNameHeb(day);
                        finalBirthText = 'תאריך לידה: ' + monthName + ' ' +  dayName + ' ' + yearToShow;
                        finalAgeText = ' (גיל ' + finalAge + ')';
                    } else {
                        changeMonthName(month - 1, 1);
                        changeDayName(day);
                        finalBirthText = 'Birth Date: ' + monthName + ' ' +  dayName + ' ' + yearToShow;
                        finalAgeText = ' (Age ' + finalAge + ')';
                    }

                    let birthDateWrapper = $('<div>', {
                        id: 'birthDateWrapper',
                        class: 'personCont'
                    }).appendTo(personDetailWrapper);

                    let birthDateImg = $('<i>', {
                        class: 'fas fa-birthday-cake',
                    }).appendTo(birthDateWrapper);

                    let personBirthDate = $('<p>', {
                        id: 'personBirthDate',
                        text: finalBirthText,
                    }).appendTo(birthDateWrapper);

                    if (data.deathday == null) {
                        let personBirthAge = $('<span>', {
                            id: 'personBirthAge',
                            text: finalAgeText,
                        }).appendTo(personBirthDate);
                    }
                }

                if (data.deathday !== null) {
                    let date = new Date(data.deathday);
                    let day = date.getDate();
                    let month = date.getMonth() + 1;
                    let yearToShow = date.getFullYear();

                    let finalDeathText;
                    let finalAgeText;
                    let finalAge = getAge(data.deathday, 2, data.birthday);

                    if (lang == 'he') {
                        changeMonthNameHeb(month - 1, 1);
                        changeDayNameHeb(day);
                        finalAgeText = ' (גיל ' + finalAge + ')';
                        finalDeathText = 'תאריך פטירה: ' + monthName + ' ' +  dayName + ' ' + yearToShow;
                    } else {
                        changeMonthName(month - 1, 1);
                        changeDayName(day);
                        finalAgeText = ' (Age ' + finalAge + ')';
                        finalDeathText = 'Death Date: ' + monthName + ' ' +  dayName + ' ' + yearToShow;
                    }

                    let deathDateWrapper = $('<div>', {
                        id: 'deathDateWrapper',
                        class: 'personCont'
                    }).appendTo(personDetailWrapper);

                    let birthDateImg = $('<i>', {
                        class: 'fas fa-skull',
                    }).appendTo(deathDateWrapper);

                    let personDeathDate = $('<p>', {
                        id: 'personDeathDate',
                        text: finalDeathText,
                    }).appendTo(deathDateWrapper);

                    let personDeathAge = $('<span>', {
                        id: 'personDeathAge',
                        text: finalAgeText,
                    }).appendTo(personDeathDate);
                }

                if (data.place_of_birth !== null) {

                    let finalBirthPlaceText;

                    if (lang == 'he') {
                        finalBirthPlaceText = 'מקום לידה: ' + data.place_of_birth;
                    } else {
                        finalBirthPlaceText = 'Place Of Birth: ' + data.place_of_birth;
                    }

                    let birthPlaceWrapper = $('<div>', {
                        id: 'birthPlaceWrapper',
                        class: 'personCont'
                    }).appendTo(personDetailWrapper);

                    let birthDateImg = $('<i>', {
                        class: 'fas fa-home',
                    }).appendTo(birthPlaceWrapper);

                    let birthPlace = $('<p>', {
                        id: 'birthPlace',
                        text: finalBirthPlaceText,
                    }).appendTo(birthPlaceWrapper);
                }

                if (data.homepage !== null) {

                    let homepageWrapper = $('<div>', {
                        id: 'homepageWrapper',
                        class: 'personCont'
                    }).appendTo(personDetailWrapper);

                    let birthDateImg = $('<i>', {
                        class: 'fab fa-chrome',
                    }).appendTo(homepageWrapper);

                    let personHomepage = $('<a>', {
                        id: 'personHomepage',
                        href: data.homepage,
                        target: '_blank', 
                        text: data.homepage,
                    }).appendTo(homepageWrapper);
                }
            }

            if (data.biography !== '' && data.biography.length > 10) {

                let finalClass;

                if (data.biography.length > 250) {
                    finalClass = 'descriptionWrapper personInfo';
                } else {
                    finalClass = 'descriptionWrapper personInfo unsetHeight';
                }

                let descriptionWrapper = $('<div>', {
                    class: finalClass,
                }).appendTo(detailsWrapper);

                let description = $('<p>', {
                    class: 'objectDescription',
                    text: data.biography,
                }).appendTo(descriptionWrapper);

                if (data.biography.length > 250) {

                    let descriptionArrowWrapper = $('<div>', {
                        id: 'descriptionArrowWrapper',
                    }).appendTo(descriptionWrapper); 
                    
                    let finalArrowSrc;

                    if (darkMode) {
                        finalArrowSrc = './images/arrowInverted.png';
                    } else {
                        finalArrowSrc = './images/arrow.png';
                    }

                    let descriptionArrow = $('<img>', {
                        id: 'descriptionArrow',
                        src: finalArrowSrc,
                        alt: 'arrow',
                        click: () => {

                            if($('#descriptionArrowWrapper').hasClass('topArrow')) {
                                $('.personInfo').css({'height': '4.5rem'});
                                if (darkMode) {
                                    $('.personInfo p').css({'color': 'black', 'overflow': 'hidden'});
                                } else {
                                    $('.personInfo p').css({'color': 'lightgray', 'overflow': 'hidden'});
                                }

                                $('#descriptionArrowWrapper').removeClass('topArrow');

                            } else {
                                var el = $('.personInfo');
                                var curHeight = el.height();
                                var autoHeight = el.css('height', 'auto').height();
                                el.height(curHeight).animate({height: autoHeight}, 100);

                                if (darkMode) {
                                    $('.personInfo p').css('color', 'lightgray');
                                } else {
    
                                    $('.personInfo p').css('color', 'black');
                                }

                                $('#descriptionArrowWrapper').addClass('topArrow');                          
                            }
                        }
                    }).appendTo(descriptionArrowWrapper);
                } else {
                    $('.personInfo p').addClass('blackColor');
                }
            }
        },
        error: (err) => {
            //console.log(err);
        }
    })
}

const getPersonCredits = (personId) => {

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieActorsUrl + personId + '/combined_credits' + "?api_key=" + tmdbKey + "&language=" + lang,
        dataType: "json",
        success: (data) => {

            if (data.cast.length !== 0) {

                let creditsWrapper = $('<div>', {
                    class: 'creditsWrapper',
                }).appendTo($('#castWrapper'));
    
                let credit = $('<div>', {
                    class: 'credit'
                }).appendTo(creditsWrapper);

                let finalCreditsHeader;

                if (lang == 'he') {
                    finalCreditsHeader = 'קרדיטים';
                } else {
                    finalCreditsHeader = 'Credits';
                }

                let creditsHeader = $('<h2>', {
                    class: 'creditsHeader',
                    text: finalCreditsHeader,
                }).insertAfter($('#detailsWrapper'));

                for (let i = 0; i < data.cast.length; i++) {
        
                    if (i == data.cast.length - 1) {
                        setTimeout(() => {
                            sortPopularMovies($('.credit'), 'popularity', 1);
                            $(".creditName").slice(40).remove();
                        }, 500);
                    }
    
                    try {
                        let movieImgPath = 'https://image.tmdb.org/t/p/w1280' + data.cast[i].poster_path;
    
                        if (data.cast[i].poster_path == 'undefined' || data.cast[i].poster_path == null || data.cast[i].poster_path == '') {
    
                            movieImgPath = './images/noImage.png';
                        }
    
                        if (data.cast[i].character && data.cast[i].character.length > 25) {
    
                            if (countInstances(data.cast[i].character, '/') > 1) {
                            
                                let maxLength = 25;
                                let trimmedString = data.cast[i].character.substr(0, maxLength);
                                trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
    
                                trimmedString = data.cast[i].character.split('/');
    
                                if (trimmedString.length > 2) {
                                    trimmedString = trimmedString[0] + '/' + trimmedString[1] + '& More';
                                } else {
                                    trimmedString = trimmedString[0] + '/' + trimmedString[1];
                                }
        
                            } else {
                                trimmedString = data.cast[i].character;
                            }
    
                        } else {
                            trimmedString = data.cast[i].character;
                        }
    
                        if (trimmedString == '') {
                            trimmedString = 'Unknown'
                        }
    
                        let finalTitle;
    
                        if (data.cast[i].media_type == 'movie') {
                            finalTitle = data.cast[i].title;
                        } else {
                            finalTitle = data.cast[i].name;
                        }
    
                        if (data.cast[i].character) {
                            let creditName = $('<div>', {
                                class: 'creditName',
                                popularity: data.cast[i].popularity
                            }).appendTo(credit);
        
                            let imageLink = $('<a>', {
                                class: 'imageLink',
                                'target': '_blank'
                            }).appendTo(creditName);
        
                            let actorImg = $('<img>', {
                                class: 'actorImg',
                                src: movieImgPath,
                                alt: 'actorImg',
                                mediaType: data.cast[i].media_type,
                                id: data.cast[i].id,
                            }).appendTo(imageLink);
        
                            let moviePersonName = $('<span>', {
                                class: 'moviePersonName',
                                text: finalTitle + ':'
                            }).appendTo(creditName);
    
                            if (lang == 'he' && regex.test($(moviePersonName).html())) {
                                $(moviePersonName).addClass('hebTitle');
                            }
        
                            let characterName = $('<span>', {
                                class: 'characterName',
                                text: trimmedString
                            }).appendTo(creditName);
                        }
    
                    } catch (e) {
                        return;
                    }
                }
    
                var interval = setInterval(() => {
                    if ($('.castName').length !== 0 && $('#castWrapper').is(':visible') || $('.creditName').length !== 0 && $('#castWrapper').is(':visible')) {
                        clearInterval(interval);
                        $('#contentWrapper').css({'pointer-events': 'all', 'opacity': 1});
                        $('#spinner').hide();

                        if (lang == 'he') {

                            for (let j = 0; j < personNames[0].length; j++) {
                                if (regex.test(personNames[0][j])) {
                                    $('#chosenMovieTitle').html(personNames[0][j]);
                                    $('#chosenMovieTitle').css('direction', 'rtl');
                                }     
                            }
                        }

                        $('.actorImg').click(function() {
    
                            let nameToImdb = $(this).parent().parent().find($('.moviePersonName')).html().replace(':', '');
    
                            $('#chosenMovieTitle, .movieWrapper, #socialLinksWrapper, .creditsHeader').remove();
                            $('#popularPeopleWrapper').empty().hide();
                            $('.chosenMovieSection').empty();
                            $('#results').fadeOut('fast');
                            $('#searchMovie').val('');
                            $('.btnWrapper').hide();
    
                            if ($(this)[0].attributes.mediaType.textContent == 'movie') {
                                objectClicked($(this).attr('id'), nameToImdb.toString(), nameToImdb.toString(), 1);
                            } else {
                                objectClicked($(this).attr('id'), nameToImdb.toString(), nameToImdb.toString(), 2);
                            }   
                        })
                    }
                }, 400);
            } else {
                setTimeout(() => {
                    $('#contentWrapper').css({'pointer-events': 'all', 'opacity': 1});
                    $('#spinner').hide();
                }, 3500)
            }
        },
        error: (err) => {
            //console.log(err);
        }
    })
}

const getExternalIds = (personId) => {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieActorsUrl + personId + '/external_ids' + "?api_key=" + tmdbKey + "&language=" + lang,
        dataType: "json",
        success: (data) => {

            if ((data.instagram_id == null && data.twitter_id == null && data.facebook_id == null) || (data.instagram_id == '' && data.twitter_id == '' && data.facebook_id == '')) {
            } else {
                let socialLinksWrapper = $('<div>', {
                    id: 'socialLinksWrapper',
                }).insertAfter($('#chosenMovieTitle'));
            }

            if (data.instagram_id !== null && data.instagram_id !== '') {

                let instagramLink = $('<a>', {
                    class: 'instagramLink',
                    target: '_blank',
                    rel: 'noopener',
                    href: 'https://www.instagram.com/' + data.instagram_id
                }).appendTo(socialLinksWrapper);
    
                let instagramImage = $('<img>', {
                    class: 'personInstagramImage',
                    src: './images/instagram.png',
                    alt: 'instagramImage',
                }).appendTo(instagramLink);
            }

            if (data.twitter_id !== null && data.twitter_id !== '') {

                let twitterLink = $('<a>', {
                    class: 'twitterLink',
                    target: '_blank',
                    rel: 'noopener',
                    href: 'https://www.twitter.com/' + data.twitter_id
                }).appendTo(socialLinksWrapper);
    
                let twitterImage = $('<img>', {
                    class: 'personTwitterImage',
                    src: './images/twitter.png',
                    alt: 'twitterImage',
                }).appendTo(twitterLink);
            }

            if (data.facebook_id !== null && data.facebook_id !== '') {

                let facebookLink = $('<a>', {
                    class: 'facebookLink',
                    target: '_blank',
                    rel: 'noopener',
                    href: 'https://www.facebook.com/' + data.facebook_id
                }).appendTo(socialLinksWrapper);
    
                let facebookImage = $('<img>', {
                    class: 'personFacebookImage',
                    src: './images/facebook2.png',
                    alt: 'facebookImage',
                }).appendTo(facebookLink);
            }
        },
        error: (err) => {
            //console.log(err);
        }
    })
}

const getPersonMovieImages = (personId) => {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieActorsUrl + personId + '/tagged_images' + "?api_key=" + tmdbKey + "&language=" + lang,
        dataType: "json",
        success: (data) => {

            let objectGallery = $('<div>', {
                class: 'objectGallery',
            }).appendTo($('#galleryWrapper'));

            for (let i = 0; i < data.results.length; i++) {

                let galleryImg;

                if (data.results[i].media.backdrop_path !== null) {

                    galleryImg = data.results[i].media.backdrop_path;

                    let galleryImgPath;

                    if (galleryImg == null || galleryImg == '') {
    
                        galleryImgPath = './images/noImage.png';
                    } else {
                        galleryImgPath = 'https://image.tmdb.org/t/p/w1280' + galleryImg;
                    }

                    let movieGalleryImg = $('<img>', {
                        class: 'movieGalleryImg lazy',
                        'data-src': galleryImgPath,
                        src: './images/stock.png',
                        alt: 'movieGalleryImg',
                    }).appendTo(objectGallery);
                }
            }
        },
        error: (err) => {
            //console.log(err);
        }
    })
}

const getPersonImages = (personId) => {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieActorsUrl + personId + '/images' + "?api_key=" + tmdbKey + "&language=" + lang,
        dataType: "json",
        success: (data) => {

            let objectGallery = $('<div>', {
                class: 'objectGallery',
            }).appendTo($('#galleryWrapper'));

            for (let i = 0; i < data.profiles.length; i++) {
                let movieGalleryImg = $('<img>', {
                    class: 'movieGalleryImg personGalleryImage lazy',
                    'data-src': 'https://image.tmdb.org/t/p/w1280' + data.profiles[i].file_path,
                    src: './images/stock.png',
                    alt: 'movieGalleryImg',
                }).appendTo(objectGallery);
            }
        },
        error: (err) => {
            //console.log(err);
        }
    })
}

const getObjectInfo = (objectId, movieTitle, originalTitle, kind) => {

    $('#chosenMovie').attr('chosenId', objectId);

    arr = [];
    let url;
    let tmdbUrl;

    if (kind == 1) {
        tmdbUrl = movieInfoUrl;
    } else {
        tmdbUrl = tvShowInfoUrl;
    }

    url = originalTitle.replace(/[^A-Za-z0-9]+/g, "");

    window.history.pushState('page2', 'Title', '?' + url);
    window.addEventListener('popstate', (event) => {
        window.location.reload();
    });

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tmdbUrl + objectId + "?api_key=" + tmdbKey + "&language=" + lang,
        dataType: "json",
        success: (data) => {
            page = 1;

            if (script !== undefined && script !== null) {
                $(script).remove();
            }

            setTimeout(() => {
                script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://www.youtube.com/iframe_api';
                $(script).addClass('youtubeScript');
                document.getElementsByTagName('head')[0].appendChild(script);
            }, 1300);

            $('.logo').css('cursor', 'pointer');

            objectImage = data.backdrop_path;
            if (kind == 1) {
                imdbId = data.imdb_id;
                let movieReleaseDate = data.release_date;
                date = new Date(movieReleaseDate);

            } else {
                let tvShowReleaseDate = data.first_air_date;
                date = new Date(tvShowReleaseDate);
            }

            let finalImg;

            if (objectImage == null) {

                if (finalImg == null) {
                    finalImg = './images/stockMovie.jpg';
                } else {
                    finalImg = 'https://image.tmdb.org/t/p/w1280' + data.poster_path;
                    setTimeout(() => {
                        $('.imdbImage').css('width', '200px');
                    }, 1500);
                }
            } else {
                finalImg = 'https://image.tmdb.org/t/p/w1280' + objectImage;
            }

            let month = date.getMonth();
            let year = date.getFullYear();
            let day = date.getDate();

            if (lang == 'he') {
                changeMonthNameHeb(month, 1);
                changeDayNameHeb(day);
            } else {
                changeMonthName(month, 1);
                changeDayName(day);
            }

            let detailsWrapper = $('<div>', {
                class: 'detailsWrapper',
            }).appendTo($('#detailsWrapper'));

            if (kind == 1) {
                var imdbLink = $('<a>', {
                    class: 'imdbLink',
                    target: '_blank',
                    rel: 'noopener',
                    href: imdb + imdbId
                }).appendTo(detailsWrapper);
                var withCommas = numberWithCommas(data.revenue);
            } else {
                var imdbLink = $('<a>', {
                    class: 'imdbLink',
                    target: '_blank',
                    rel: 'noopener',
                }).appendTo(detailsWrapper);
            }

            let imdbImage = $('<img>', {
                class: 'imdbImage',
                src: finalImg,
                alt: 'imdbImage',
            }).appendTo(imdbLink);

            if (data.tagline !== '') {

                let tagline = $('<div>', {
                    class: 'tagline',
                    text: data.tagline
                }).appendTo(detailsWrapper);
            }

            if (data.production_companies !== 0 && data.production_companies !== undefined) {

                let productionCompaniesWrapper = $('<div>', {
                    id: 'productionCompaniesWrapper',
                }).appendTo(detailsWrapper);

                for (let i = 0; i < data.production_companies.length; i++) {

                    if (data.production_companies[i].logo_path !== null && data.production_companies[i].logo_path !== undefined) {
                        let productionCompany = $('<img>', {
                            class: 'productionCompany',
                            alt: data.production_companies[i].name,
                            src: 'https://image.tmdb.org/t/p/w1280' + data.production_companies[i].logo_path,
                        }).appendTo(productionCompaniesWrapper);

                        var srcs = [];
                        var temp;
                        $(".productionCompany").filter(function(){
                            temp = $(this).attr("src");
                            if($.inArray(temp, srcs) < 0){
                                srcs.push(temp);   
                                return false;
                            }
                            return true;
                        }).remove();
                    }
                }
            }

            if (data.overview !== '') {

                let descriptionWrapper = $('<div>', {
                    class: 'descriptionWrapper',
                }).appendTo(detailsWrapper);

                let description = $('<p>', {
                    class: 'objectDescription',
                    text: data.overview,
                }).appendTo(descriptionWrapper);
            }

            let objectDetails = $('<div>', {
                class: 'objectDetails',
            }).appendTo(detailsWrapper);

            if (kind == 1) {

                if (withCommas !== '0' && withCommas !== 0) {

                    let finalRevenueText;

                    if (lang == 'he') {
                        finalRevenueText = 'רווחים: ' + withCommas + ' $ ';
                    } else {
                        finalRevenueText = 'Revenue: ' + ' $ ' + withCommas;
                    }

                    let revenue = $('<p>', {
                        class: 'movieRevenue',
                        text: finalRevenueText,
                    }).appendTo(objectDetails);

                    let dollarIcon = $('<i>', {
                        class: 'fas fa-money-bill-wave detailIcon',
                    }).appendTo(revenue);
                }

                if (data.runtime !== '0' && data.runtime !== 0) {

                    let hoursRuntime;

                    if (lang == 'he') {
                        hoursRuntime = convertMinsToHrsMinsHeb(data.runtime);
                    } else {
                        hoursRuntime = convertMinsToHrsMins(data.runtime);
                    }

                    let finalRuntimeText;

                    if (lang == 'he') {
                        finalRuntimeText = 'אורך: ' + hoursRuntime;
                    } else {
                        finalRuntimeText = 'Runtime: ' + hoursRuntime;
                    }

                    let runtime = $('<p>', {
                        class: 'movieRuntime',
                        text: finalRuntimeText,
                    }).appendTo(objectDetails);

                    let clockIcon = $('<i>', {
                        class: 'fas fa-clock detailIcon',
                    }).appendTo(runtime);
                }

            } else {

                let finalSeasonsText;
                let finalEpisodesText;

                if (lang == 'he') {
                    finalSeasonsText = 'עונות: ' + data.number_of_seasons;
                    finalEpisodesText = 'פרקים: ' + data.number_of_episodes;
                } else {
                    finalSeasonsText = 'Seasons: ' + data.number_of_seasons;
                    finalEpisodesText = 'Episode: ' + data.number_of_episodes;
                }

                let seasonsNum = $('<p>', {
                    class: 'seasonsNum',
                    text: finalSeasonsText,
                }).appendTo(objectDetails);

                let tvIcon = $('<i>', {
                    class: 'fas fa-tv detailIcon',
                }).appendTo(seasonsNum);

                let episodesNum = $('<p>', {
                    class: 'episodesNum',
                    text: finalEpisodesText,
                }).appendTo(objectDetails);

                let episodeIcon = $('<i>', {
                    class: 'fas fa-clone detailIcon',
                }).appendTo(episodesNum);
            }

            if (data.release_date !== '') {

                let finalReleaseText;

                if (lang == 'he') {
                    finalReleaseText = 'תאריך יציאה: ' + monthName + ' ' + dayName + ' ' + year;
                } else {
                    finalReleaseText = 'Release Date: ' + monthName + ' ' + dayName + ' ' + year;
                }

                let releaseDate = $('<p>', {
                    class: 'releaseDate',
                    text: finalReleaseText,
                }).appendTo(objectDetails);
  
                let calendarIcon = $('<i>', {
                    class: 'fas fa-calendar-alt detailIcon',
                }).appendTo(releaseDate);
            }

            let todayDate = new Date();
					
            let finalDateForShow;
            
            if (kind == 1) {
                finalDateForShow = data.release_date;
            } else {
                finalDateForShow = data.first_air_date;
            }

            let finalVoteText;

            finalVoteText = data.vote_average.toString();

            if ((finalVoteText.length == 1 && data.vote_average !== '0') || data.vote_average == '10') {
                finalVoteText = data.vote_average + '0'
            } else {
                finalVoteText = data.vote_average;
            }

            finalVoteText = finalVoteText.toString();

            finalVoteText = finalVoteText.replace('.', '') + '%';

            if (finalVoteText == '0%' && JSON.stringify(finalDateForShow > todayDate)) {
                finalVoteText = 'TBD';
            }
        
            if (finalVoteText !== 0 && finalVoteText !== undefined) {

                let finalRatingText;

                if (lang == 'he') {
                    finalRatingText = 'ציון: ' + finalVoteText;
                } else {
                    finalRatingText = 'Rating: ' + finalVoteText;
                }

                let rating = $('<p>', {
                    class: 'rating',
                    text: finalRatingText,
                }).appendTo(objectDetails);
  
                let ratingIcon = $('<i>', {
                    class: 'fas fa-star detailIcon',
                }).appendTo(rating);
            }

            if (data.original_language !== 0 && data.original_language !== undefined) {

                let finalLangText;

                if (lang == 'he') {
                    finalLangText = 'שפה: ' + data.original_language;
                } else {
                    finalLangText = 'Language: ' + data.original_language;
                }

                let language = $('<p>', {
                    class: 'language',
                    text: finalLangText,
                }).appendTo(objectDetails);
  
                let langIcon = $('<i>', {
                    class: 'fas fa-language detailIcon',
                }).appendTo(language);
            }

            let objectGenreWrapper = $('<div>', {
                class: 'objectGenreWrapper',
            }).appendTo(objectDetails);

            let finalGenresText;

            if (lang == 'he') {
                finalGenresText = "ג'אנרים: ";
            } else {
                finalGenresText = 'Genres: ';
            }

            let objectGenreHead = $('<span>', {
                class: 'objectGenreHead',
                text: finalGenresText,
            }).appendTo(objectGenreWrapper);

            for (let i = 0; i < data.genres.length; i++) {
                arr.push(data.genres[i].name);
                arr.join(' , ');
            }

            let objectGenre = $('<span>', {
                class: 'objectGenre',
                text: arr,
            }).appendTo(objectGenreWrapper);

            let genreIcon = $('<i>', {
                class: 'fas fa-window-restore detailIcon',
            }).appendTo(objectGenre);
        },
        error: (err) => {
            //console.log(err);
        }
    })
}

const getCredits = (objectId, kind) => {

    directorCounter = 0;

    let tmdbUrl;

    if (kind == 1) {
        tmdbUrl = movieInfoUrl;
    } else {
        tmdbUrl = tvShowInfoUrl;
    }

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tmdbUrl + objectId + "/credits?api_key=" + tmdbKey + "&language=" + lang,
        dataType: "json",
        success: (data) => {

            if (data.crew.length > 0 && kind == 1) {

                let directorHeader = $('<h2>', {
                    class: 'directorHeader',
                }).appendTo($('#directorWrapper'));

                let directorWrapper = $('<div>', {
                    class: 'directorWrapper',
                }).appendTo($('#directorWrapper'));
    
                let director = $('<div>', {
                    class: 'director'
                }).appendTo(directorWrapper);

                for (let i = 0; i < data.crew.length; i++) {
                    if (data.crew[i].job == 'Director') {

                        directorCounter++;               

                        try {
                            let actorImgPath;
        
                            if (data.crew[i].profile_path == 'undefined' || data.crew[i].profile_path == null || data.crew[i].profile_path == '') {
        
                                switch (data.crew[i].gender) {
                                    case 0:
                                        actorImgPath = './images/actor.png';
                                        break;
                                    case 1:
                                        actorImgPath = './images/actress.png';
                                        break;
                                    case 2:
                                        actorImgPath = './images/actor.png';
                                        break;
                                }
                            } else {
                                actorImgPath = 'https://image.tmdb.org/t/p/w1280' + data.crew[i].profile_path;
                            }
        
                            let directorName = $('<div>', {
                                class: 'directorName',
                            }).appendTo(director);
        
                            let imageLink = $('<a>', {
                                class: 'imageLink',
                            }).appendTo(directorName);
        
                            let actorImg = $('<img>', {
                                class: 'actorImg',
                                src: actorImgPath,
                                alt: 'actorImg',
                                id: data.crew[i].id,
                            }).appendTo(imageLink);
        
                            let actorName = $('<span>', {
                                class: 'actorName',
                                text: data.crew[i].name
                            }).appendTo(directorName);
    
                            if (lang == 'he' && regex.test($(actorName).html())) {
                                $(actorName).addClass('hebTitle');
                            }
        
                            let linksWrapper = $('<div>', {
                                class: 'linksWrapper',
                            }).appendTo(directorName);
        
                            let imdbLinkWrapper = $('<a>', {
                                class: 'imdbLinkWrapper',
                            }).appendTo(linksWrapper);
        
                            let imdbLink = $('<img>', {
                                src: './images/imdb.png',
                                alt: 'imdbImg',
                                class: 'imdbLink',
                                id: data.crew[i].id,
                                click: function () {
                                    goToActorImdb($(this)[0].attributes.id.textContent, $($(this)[0].parentElement), 1);
                                }
                            }).appendTo(imdbLinkWrapper);
        
                            let instagramWrapper = $('<a>', {
                                class: 'instagramWrapper',
                            }).appendTo(linksWrapper);
        
                            let instagramLink = $('<img>', {
                                src: './images/instagram.png',
                                alt: 'instagramImg',
                                class: 'instagramLink',
                                id: data.crew[i].id,
                                click: function () {
                                    goToActorImdb($(this)[0].attributes.id.textContent, $($(this)[0].parentElement), 2);
                                }
                            }).appendTo(instagramWrapper);
        
                        } catch (e) {
                            return;
                        }
                    }
                }

                setTimeout(() => {
                    if (directorCounter > 1) {

                        if (lang == 'he') {
                            $('.directorHeader').html('במאים');
                        } else {
                            $('.directorHeader').html('Directors');
                        }
                    } else {
                        if (lang == 'he') {
                            $('.directorHeader').html('במאי');
                        } else {
                            $('.directorHeader').html('Director');
                        }
                    }

                }, 1000)
            }

            if (data.cast.length > 0) {
   
                let finalCastText;

                if (lang == 'he') {
                    finalCastText = 'שחקנים';
                } else {
                    finalCastText = 'Cast';
                }

                let castHeader = $('<h2>', {
                    class: 'castHeader',
                    text: finalCastText,
                }).appendTo($('#castWrapper'));

                let castWrapper = $('<div>', {
                    class: 'castWrapper',
                }).appendTo($('#castWrapper'));
    
                let cast = $('<div>', {
                    class: 'cast'
                }).appendTo(castWrapper);
    
                let finalLength;
    
                if (data.cast.length < 21) {
                    finalLength = data.cast.length;
                } else {
                    finalLength = 21
                }
    
                for (let i = 0; i < finalLength; i++) {

                    try {
    
                        let actorImgPath;
    
                        if (data.cast[i].profile_path == 'undefined' || data.cast[i].profile_path == null || data.cast[i].profile_path == '') {
    
                            switch (data.cast[i].gender) {
                                case 0:
                                    actorImgPath = './images/actor.png';
                                    break;
                                case 1:
                                    actorImgPath = './images/actress.png';
                                    break;
                                case 2:
                                    actorImgPath = './images/actor.png';
                                    break;
                            }
                        } else {
                            actorImgPath = 'https://image.tmdb.org/t/p/w1280' + data.cast[i].profile_path;
                        }
    
                        let trimmedString;

                        if (data.cast[i].character.length > 25) {
    
                            if (countInstances(data.cast[i].character, '/') > 1) {
                            
                                let maxLength = 25;
                                trimmedString = data.cast[i].character.substr(0, maxLength);
                                trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
    
                                trimmedString = data.cast[i].character.split('/');
    
                                if (trimmedString.length > 2) {
                                    trimmedString = trimmedString[0] + '/' + trimmedString[1] + '& More';
                                } else {
                                    trimmedString = trimmedString[0] + '/' + trimmedString[1];
                                }
        
                            } else {
                                trimmedString = data.cast[i].character;
                            }
    
                        } else {
                            trimmedString = data.cast[i].character;
                        }
    
                        let castName = $('<div>', {
                            class: 'castName',
                        }).appendTo(cast);
    
                        let imageLink = $('<a>', {
                            class: 'imageLink',
                        }).appendTo(castName);
    
                        let actorImg = $('<img>', {
                            class: 'actorImg',
                            src: actorImgPath,
                            alt: 'actorImg',
                            id: data.cast[i].id,
                        }).appendTo(imageLink);
    
                        let actorName = $('<span>', {
                            class: 'actorName',
                            text: data.cast[i].name + ':'
                        }).appendTo(castName);

                        if (lang == 'he' && regex.test($(actorName).html())) {
                            $(actorName).addClass('hebTitle');
                        }  
    
                        let characterName = $('<span>', {
                            class: 'characterName',
                            text: trimmedString
                        }).appendTo(castName);
    
                        let linksWrapper = $('<div>', {
                            class: 'linksWrapper',
                        }).appendTo(castName);
    
                        let imdbLinkWrapper = $('<a>', {
                            class: 'imdbLinkWrapper',
                        }).appendTo(linksWrapper);
    
                        let imdbLink = $('<img>', {
                            src: './images/imdb.png',
                            alt: 'imdbImg',
                            class: 'imdbLink',
                            id: data.cast[i].id,
                            click: function () {
                                goToActorImdb($(this)[0].attributes.id.textContent, $($(this)[0].parentElement), 1);
                            }
                        }).appendTo(imdbLinkWrapper);
    
                        let instagramWrapper = $('<a>', {
                            class: 'instagramWrapper',
                        }).appendTo(linksWrapper);
    
                        let instagramLink = $('<img>', {
                            src: './images/instagram.png',
                            alt: 'instagramImg',
                            class: 'instagramLink',
                            id: data.cast[i].id,
                            click: function () {
                                goToActorImdb($(this)[0].attributes.id.textContent, $($(this)[0].parentElement), 2);
                            }
                        }).appendTo(instagramWrapper);
    
                    } catch (e) {
                        return;
                    }
                }
            }
        },
        error: (err) => {
            //console.log(err);
        }
    })
}

const countInstances = (string, word) => {
    return string.split(word).length - 1;
}

const getImages = (objectId, kind) => {

    let tmdbUrl;

    if (kind == 1) {
        tmdbUrl = movieInfoUrl;
    } else {
        tmdbUrl = tvShowInfoUrl;
    }

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tmdbUrl + objectId + "/images?api_key=" + tmdbKey,
        dataType: "json",
        success: (data) => {

            let objectGallery = $('<div>', {
                class: 'objectGallery',
            }).appendTo($('#galleryWrapper'));

            let finalLength;

            if (data.backdrops.length < 10) {
                finalLength = data.backdrops.length;
            } else {
                finalLength = 11;
            }

            for (let i = 0; i < finalLength; i++) {

                try {
                    let galleryImg = data.backdrops[i].file_path;
                    let galleryImgPath;
    
                    if (galleryImg == null || galleryImg == '') {
    
                        galleryImgPath = './images/noImage.png';
                    } else {
                        galleryImgPath = 'https://image.tmdb.org/t/p/w1280' + galleryImg;
                    }
    
                    if (i !== 0) {
                        let movieGalleryImg = $('<img>', {
                            class: 'movieGalleryImg lazy',
                            'data-src': galleryImgPath,
                            src: './images/stock.png',
                            alt: 'movieGalleryImg',
                        }).appendTo(objectGallery);
                    }
                } catch (error) {
                    
                }
            }
        },
        error: (e) => {
            //console.log(e);
        }
    })
}

const getVideos = (objectId, kind) => {

    let tmdbUrl;

    if (kind == 1) {
        tmdbUrl = movieInfoUrl;
    } else {
        tmdbUrl = tvShowInfoUrl;
    }

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tmdbUrl + objectId + "/videos?api_key=" + tmdbKey + "&language=" + lang,
        dataType: "json",
        success: (data) => {

            let objectVideos = $('<div>', {
                class: 'objectVideos',
            }).appendTo($('#videosWrapper'));

            for (let i = 0; i < 5; i++) {
                if (data.results[i] == undefined || data.results[i] == null) {
                    return;
                }

                let objectUrl = youtubeVideo + data.results[i].key + '?showinfo=0&enablejsapi=1';
                let movieVideo = $('<iframe>', {
                    class: 'movieVideo',
                    id: 'movieVideo' + i,
                    src: objectUrl,
                    width: '420',
                    height: '315',
                    allowfullscreen: true,

                }).appendTo(objectVideos);
            }
        },
        error: (err) => {
            //console.log(err);
        }
    })
}

const getReviews = (objectId, kind) => {

    let tmdbUrl;

    if (kind == 1) {
        tmdbUrl = movieInfoUrl;
    } else {
        tmdbUrl = tvShowInfoUrl;
    }

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tmdbUrl + objectId + "/reviews?api_key=" + tmdbKey + "&language=" + lang,
        dataType: "json",
        success: (data) => {
            if (data.results.length !== 0) {

                let finalHedaer;
    
                if (lang == 'he') {
                    finalHedaer = 'ביקורות';
                } else {
                    finalHedaer = 'Reviews';
                }
    
                let reviewsHeader = $('<h2>', {
                    id: 'reviewsHeader',
                    text: finalHedaer
                }).appendTo($('#reviewsWrapper'));

                if (data.results.length !== 1) {

                    let reviewsBtns = $('<div>', {
                        id: 'reviewsBtns',
                    }).appendTo($('#reviewsWrapper'));

                    let reviewsLeft = $('<img>', {
                        id: 'reviewsLeft',
                        src: './images/leftArrow.png',
                        alt: 'arrow',
                        click: () => {
                            let currentSlide = $('.chosenSlide').attr('slideNum');
        
                            changeSlide(1, currentSlide);
                        }
                    }).appendTo(reviewsBtns);
        
                    let reviewsRight = $('<img>', {
                        id: 'reviewsRight',
                        src: './images/rightArrow.png',
                        alt: 'arrow',
                        click: () => {
        
                            let currentSlide = $('.chosenSlide').attr('slideNum');
        
                            changeSlide(2, currentSlide);
                        }
                    }).appendTo(reviewsBtns);
                }

                for (let i = 0; i < data.results.length; i++) {

                    let finalClass;
                    if (i == 0) {
                        finalClass = 'reviewContainer firstReview review' + i + ' chosenSlide';
                    } else if(i == data.results.length - 1){
                        finalClass = 'reviewContainer finalReview review' + i;
                    } else {
                        finalClass = 'reviewContainer review' + i;
                    }

                    let reviewContainer = $('<div>', {
                        class: finalClass,
                        'slideNum': i
                    }).appendTo($('#reviewsWrapper')); 
    
                    let objectReview = $('<div>', {
                        class: 'objectReview',
                    }).appendTo(reviewContainer);
    
                    let reviewAuthor = $('<p>', {
                        class: 'reviewAuthor',
                        text: data.results[i].author
                    }).appendTo(objectReview);
    
                    let reviewContent = $('<p>', {
                        class: 'reviewContent',
                        text: data.results[i].content
                    }).appendTo(objectReview);

                    if (data.results[i].content.length > 250) {

                        let reviewArrowWrapper = $('<div>', {
                            class: 'reviewArrowWrapper',
                        }).appendTo(reviewContainer);

                        let finalArrowSrc;

                        if (darkMode) {
                            finalArrowSrc = './images/arrowInverted.png';
                        } else {
                            finalArrowSrc = './images/arrow.png';
                        }
  
                        let reviewArrow = $('<img>', {
                            class: 'reviewArrow',
                            src: finalArrowSrc,
                            alt: 'arrow',
                            click: function() {

                                $('.reviewArrowWrapper').removeClass('topArrowReview');
                                $('.objectReview').css({'height': '8.5rem'});
                                $('.reviewContent').css({'overflow': 'hidden'});

                                document.querySelector('#reviewsWrapper').scrollIntoView({ behavior: 'smooth' });

                                let object = $(this).parent().parent().find($('.objectReview'));
                                let content = $(this).parent().parent().find($('.reviewContent'));
                                let arrowWrapper = $(this).parent().parent().find($('.reviewArrowWrapper'));

                                if ($(object).css('height') !== '136px') {
                                    $(object).css({'height': '8.5rem'});

                                    if (darkMode) {
                                        $(content).css({'color': 'black', 'overflow': 'hidden'});
                                    } else {
                                        $(content).css({'color': 'lightgray', 'overflow': 'hidden'});
                                    }

                                    $(arrowWrapper).removeClass('topArrowReview');
    
                                } else {
                                    var el = $(object);
                                    var curHeight = el.height();
                                    var autoHeight = el.css('height', 'unset').height();
                                    el.height(curHeight).animate({height: autoHeight}, 100);

                                    if (darkMode) {
                                        $(content).css({'color': '#d4d4d4'});
                                    } else {
                                        $(content).css({'color': 'black'});
                                    }

                                    $(arrowWrapper).addClass('topArrowReview');
                                }
                            }
                        }).appendTo(reviewArrowWrapper);
                    } else {
                        if (darkMode) {
                            $(reviewContent).addClass('darkModeColor');
                        } else {
                            $(reviewContent).addClass('blackColor');
                        }
                    }
                }    
            }
        },
        error: (err) => {
            //console.log(err);
        }
    })
}

const changeSlide = (type, currentSlide) => {

    if (type == 1) {

        if ($('.chosenSlide').attr('slideNum') == 1) {
            $('#reviewsLeft').hide();
            $('#reviewsBtns').css('justify-content', 'flex-end');
        } else {
            $('#reviewsBtns').css('justify-content', 'space-between');
        }   

        if ($('.chosenSlide').hasClass('finalReview')) {
            $('#reviewsRight').show();
        }

        $('.chosenSlide').removeClass('chosenSlide');
        $('.review' + Number(Number(currentSlide) - 1)).addClass('chosenSlide');

    } else {

        let beforeFinalSlide = Number(Number($('.finalReview').attr('slideNum')) - 1);

        if ($('.chosenSlide').attr('slideNum') == beforeFinalSlide) {
            $('#reviewsRight').hide();
        }

        if (currentSlide == 0) {
            $('#reviewsLeft').show();
            $('#reviewsBtns').css('justify-content', 'space-between');
        }

        $('.chosenSlide').removeClass('chosenSlide');
        $('.review' + Number(Number(currentSlide) + 1)).addClass('chosenSlide');
    }
}

const getTvShowImdbId = (tvShowId) => {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tvShowInfoUrl + tvShowId + "/external_ids" + "?api_key=" + tmdbKey + "&language=" + lang,
        dataType: "json",
        success: (data) => {
            $('.detailsWrapper').find($('.imdbLink').attr('href', 'https://www.imdb.com/title/' + data.imdb_id))
        },
        error: (err) => {
            //console.log(err);
        }
    })
}

const characterClick = (movieId, movieName) => {

    let finalName;

    if (lang == 'he') {
        switch(movieId) {
            case '315635':
                finalName = 'ספיידרמן: השיבה הביתה'
            break;
            case '1726':
                finalName = 'איירון מן'
                break;
            case '299537':
                finalName = 'קפטן מארוול'
                break;
        }
    } else {
        finalName = movieName
    }

    $('#chosenMovieTitle, .movieWrapper, #socialLinksWrapper, .creditsHeader').remove();
    $('#popularPeopleWrapper').empty().hide();
    $('.chosenMovieSection').empty();
    $('#results').fadeOut('fast');
    $('#searchMovie').val('');
    $('.btnWrapper').hide();
    objectClicked(movieId, finalName, movieName, 1);
}

async function objectClicked(id, name, originalName, type) {
    
    window.onscroll = () => {
        scrollIndicator();
        scrollBtn();
        lazyload();
    };

    $('#chosenMovie').attr('chosenId', '');

    $('#socialLinksWrapper').remove();

    if (page == 4) {
        $('.favoriteWrapper').remove();   
        $('#myAccountWrapper, #userWrapper').empty().hide(); 
    } else if(page == 5 || page == 3) {
        if (darkMode) {
            $('html, body').css({'background': '#323538'});
        } else {
            $('html, body').css({'background': 'unset'});
        }
        $('.inputWrapper').show();
        $('#myAccountWrapper, #userWrapper').empty().hide();
    }

    $('#contentWrapper').css({'pointer-events': 'none', 'opacity': .5});
    $('#container').addClass('singleMovieContainer');
    $('#container, .bottomSection, #switchContentBtnWrapper').hide();
    $('#spinner').fadeIn('fast');
    $('.movieImg').remove();

    let title = $('<p>', {
        text: name,
        id: 'chosenMovieTitle'
    }).insertBefore($('#detailsWrapper'));

    if (lang == 'he' && regex.test($(title).html())) {
        $(title).addClass('hebTitle');
    }

    let width = 1;
    let id2 = setInterval(frame, 30);
    
    function frame() {
        width++;
        if (width >= 100) {
            clearInterval(id2);
            $('#container').fadeIn('slow');
            $('#chosenMovie').fadeIn('slow');

            didPopularLoaded = false;
            didImagesLoaded = false;

            $('.bottomSection').show();
            width = 1;
        }
    }

    $('#chosenMovie').off();
    $('.actorImg').off();
    
    if (type == 3) {

        let promise = new Promise((resolve, reject) => {
            resolve(getPersonInfo(id, name));
        });
        
        let promise2 = new Promise((resolve, reject) => {
            resolve(getPersonCredits(id, name));
        });

        let promise3 = new Promise((resolve, reject) => {
            resolve(getExternalIds(id, name));
        });

        let promise4 = new Promise((resolve, reject) => {
            resolve(getPersonMovieImages(id));
        });

        let promise5 = new Promise((resolve, reject) => {
            resolve(getPersonImages(id));
        });

        await Promise.all([promise, promise2, promise3, promise4, promise5]);
        
    } else {
        let promise = new Promise((resolve, reject) => {
            resolve(getObjectInfo(id, name, originalName, type));
        });
        
        let promise2 = new Promise((resolve, reject) => {
            resolve(getCredits(id, type));
        });
        
        let promise3 = new Promise((resolve, reject) => {
            resolve(getSimilar(id, type));
        });
            
        if(type == 2) {
            let promise4 = new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(getTvShowImdbId(id));
                }, 1000)
            });
            await Promise.all([promise, promise2, promise3, promise4]);
        } else {
            await Promise.all([promise, promise2, promise3]);
        }
    
        setTimeout(() => {

            if (userLoggedIn && type == 1 || userLoggedIn && type == 2) {    
                $('#chosenMovie').find($('.addToFavoritesBtn')).remove();
                
                let addToFavoritesBtn = $('<img>', {
                    class: 'addToFavoritesBtn chosenMovieSection',
                    src: './images/emptyStar.png',
                    alt: 'star',
                    click: function() {
                        if ($(this).attr('src') == './images/emptyStar.png') {
                            $(this).attr('src', './images/fullStar.png');
                        } else {
                            $(this).attr('src', './images/emptyStar.png');
                        }
        
                        addToFavorites(Number(id), type);
                    }
                }).insertBefore($('#chosenMovieTitle'));

                let finalObjectArr;

                if (type == 1) {
                    finalObjectArr = chosenMoviesArr;
                } else {
                    finalObjectArr = chosenTvShowsArr;
                }

                if (finalObjectArr.includes(Number(id))) {
                    let starBtn = $('#chosenMovie').find($('.addToFavoritesBtn'));
                    $(starBtn).attr('src', './images/fullStar.png');
                }
            }

            var interval = setInterval(() => {
                if (($('.castName').length !== 0 && $('#castWrapper').is(':visible') || $('.creditName').length !== 0 && $('#castWrapper').is(':visible')) || $('.similarMovie').length !== 0 && $('#similarWrapper').is(':visible')) {
                    clearInterval(interval);
                    $('.objectGenre').html($('.objectGenre').html().split(',').join(', '));
                    $('#contentWrapper').css({'pointer-events': 'all', 'opacity': 1});
                    $('#spinner').hide();

                    window.onscroll = () => {
                        scrollIndicator();
                        scrollBtn();
                        lazyload();
                        scrollOnChosenObject(id, type);
                    };

                    $('.actorImg').click(function() {
                        let actorNameCredits = $(this).parent().parent().find($('.actorName')).html().replace(':', '');
                        $('#chosenMovie .addToFavoritesBtn, #chosenMovieTitle, .movieWrapper, #socialLinksWrapper, .creditsHeader').remove();
                        $('#popularPeopleWrapper').empty().hide();
                        $('.chosenMovieSection').empty();
                        $('#results').fadeOut('fast');
                        $('#searchMovie').val('');
                        $('.btnWrapper').hide();
                        objectClicked($(this)[0].attributes.id.textContent, actorNameCredits, actorNameCredits, 3);
                    })
                }
            }, 400);

        }, 3500);
    }
}

const scrollOnChosenObject = (id, type) => {

    let length = $(document).height() - Number($(window).height() + 500);

    if ($(window).scrollTop() > length && $('.movieGalleryImg').length == 0 && !$('.movieGalleryImg').is(':visible') && page == 1 && !didImagesLoaded) {

        didImagesLoaded = true;

        $('#contentWrapper').css({'pointer-events': 'none', 'opacity': '.5'});
        $('#spinner').fadeIn('fast');

        getImages(id, type);
        getVideos(id, type);
        getReviews($('#chosenMovie').attr('chosenId'), type);

        document.querySelector('#captainmarvel').scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            $('#contentWrapper').css({'pointer-events': 'all', 'opacity': 1});
            $('#spinner').hide();
        }, 2000)
    }
}

const goToActorImdb = (imdbActorId, that, linkNum) => {

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieActorsUrl + imdbActorId + "/external_ids?api_key=" + tmdbKey + "&language=" + lang,
        dataType: "json",
        success: (data) => {
            if (linkNum == 1) {

                if (data.imdb_id == null) {
                    $('#noImdbPop').show();
                    removePopup($('#noImdbPop'));
                } else {
                    that.attr('href', 'https://www.imdb.com/name/' + data.imdb_id);
                    that.attr('target', '_blank');
                    that.attr('rel', 'noopener');
                    let actorImdbLink = $(that).parent().find($('.imdbLink'))
                    actorImdbLink.trigger("click");
                    actorImdbLink.off();
                }

            } else {
                if (data.instagram_id == null) {
                    $('#noInstagramPop').show();
                    removePopup($('#noInstagramPop'));
                } else {
                    that.attr('href', 'https://www.instagram.com/' + data.instagram_id);
                    that.attr('target', '_blank');
                    that.attr('rel', 'noopener');
                    let actorInstagramLink = $(that).parent().find($('.instagramLink'))
                    actorInstagramLink.trigger("click");
                    actorInstagramLink.off();
                }
            }
        },
        error: (err) => {
            //console.log(err);
        }
    })
}

const getSimilar = (objectId, kind) => {

    let tmdbUrl;
    let similarHeader;
    let title;

    if (kind == 1) {
        tmdbUrl = movieInfoUrl;

        if (lang == 'he') {
            similarHeader = 'סרטים דומים';
        } else {
            similarHeader = 'Similar Movies';
        }

    } else {
        tmdbUrl = tvShowInfoUrl;

        if (lang == 'he') {
            similarHeader = 'סדרות דומות';
        } else {
            similarHeader = 'Similar TV Shows';
        }
    }

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tmdbUrl + objectId + "/similar?api_key=" + tmdbKey + "&language=" + lang,
        dataType: "json",
        success: (data) => {

            let similarMoviesHeader = $('<h2>', {
                text: similarHeader,
                class: 'similarMoviesHeader'
            }).appendTo($('#similarWrapper'));

            let similarMoviesWrapper = $('<div>', {
                class: 'similarMoviesWrapper',
            }).appendTo($('#similarWrapper'));

            let similarMovies = $('<div>', {
                class: 'similarMovies'
            }).appendTo(similarMoviesWrapper);

            if (data.results.length == 0) {
                $('.similarMoviesHeader, .similarMoviesWrapper').remove();
                return;
            }

            for (let i = 0; i < data.results.length; i++) {

                if (i == data.results.length - 1) {
                    setTimeout(() => {
                        sortPopularMovies($('.similarMovies'), 'popularity', 2);
                        $(".similarMovie").slice(40).remove();
                    }, 500);
                }

                if (kind == 1) {
                    title = data.results[i].title;
                    if (lang == 'he') {
                        originalTitle = data.results[i].original_title;
                    }
                } else {
                    title = data.results[i].name;
                    if (lang == 'he') {
                        originalTitle = data.results[i].original_name;
                    }
                }

                try {
                    let img = 'https://image.tmdb.org/t/p/w1280' + data.results[i].poster_path;

                    if (data.results[i].poster_path == 'undefined' || data.results[i].poster_path == null || data.results[i].poster_path == '') {
                        img = './images/stock.png';
                    }

					let todayDate = new Date();
					
					let finalDateForShow;
                    
                    if (kind == 1) {
                        finalDateForShow = data.results[i].release_date;
                    } else {
                        finalDateForShow = data.results[i].first_air_date;
                    }

                    let similarMovie = $('<div>', {
                        class: 'similarMovie',
                        popularity: data.results[i].popularity,
                        value: data.results[i].id,
                        title: title,
                        originalTitle: originalTitle
                    }).appendTo($('.similarMovies'));

                    let imageLink = $('<a>', {
                        class: 'imageLink',
                    }).appendTo(similarMovie);

                    let similarMovieImg = $('<img>', {
                        class: 'similarMovieImg',
                        src: img,
                        alt: 'similarMovieImg',
                        id: data.results[i].id,
                        click: function () {
                            $('#chosenMovieTitle').remove();
                            $('#popularPeopleWrapper').empty().hide();
                            $('.chosenMovieSection').empty();
                            $('#results').fadeOut('fast');
                            $('#searchMovie').val('');

                            if (kind == 1) {
                                objectClicked($(this).parent().parent().attr('value'), $(this).parent().parent().attr('title').toString(), $(this).parent().parent().attr('originalTitle').toString(), 1);
                            } else {
                                objectClicked($(this).parent().parent().attr('value'), $(this).parent().parent().attr('title').toString(), $(this).parent().parent().attr('originalTitle').toString(), 2);
                            }
                        }
                    }).appendTo(imageLink);

                    let similarMovieName = $('<span>', {
                        class: 'similarMovieName',
                        text: title
                    }).appendTo(similarMovie);

                    if (lang == 'he' && regex.test($(similarMovieName).html())) {
                        $(similarMovieName).addClass('hebTitle');
                    }

                } catch (e) {
                    return;
                }
            }
        },
        error: (err) => {
            //console.log(err);
        }
    })
}

const getActorMovieInfo = (objectId, that, kind) => {

    let tmdbUrl;

    if (kind == 1) {
        tmdbUrl = movieInfoUrl;
    } else {
        tmdbUrl = tvShowInfoUrl;
    }

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tmdbUrl + objectId + "?api_key=" + tmdbKey + "&language=" + lang,
        dataType: "json",
        success: (data) => {
            if (data.imdb_id == undefined || data.imdb_id == null) {

                setTimeout(() => {
                    getTvShowImdbId(objectId);
                }, 1000)

                if ($('.actorMovieImg').is(':visible')) {
                    let actorMovieImg = $(that).find($('.actorMovieImg'));
                    actorMovieImg.trigger("click");
                    actorMovieImg.off();
                } else {
                    let similarMovieImg = $(that).find($('.similarMovieImg'));
                    similarMovieImg.trigger("click");
                    similarMovieImg.off();
                }

            } else {
                that.attr('href', 'https://www.imdb.com/title/' + data.imdb_id);
                that.attr('target', '_blank');
                that.attr('rel', 'noopener');

                if ($('.actorMovieImg').is(':visible')) {
                    let actorMovieImg = $(that).find($('.actorMovieImg'));
                    actorMovieImg.trigger("click");
                    actorMovieImg.off();
                } else {
                    let similarMovieImg = $(that).find($('.similarMovieImg'));
                    similarMovieImg.trigger("click");
                    similarMovieImg.off();
                }
            }
        },
        error: (err) => {
            //console.log(err);
        }
    })
}