
const back4appAppId = 'PiFWeHgxOwxI7Hp6FczSUFNUAFrv89aDqcQjKIH5';
const back4appJsKey = 'WWsBxmkLh6ACZZd3D9zUtAiZijXTIcUbgC4UsnP1';
let chosenMoviesArr = [];
let chosenTvShowsArr = [];
let currentUser;

let userLoggedIn = false;
let favorites = false;

$(document).ready((event) => {
    Parse.initialize(back4appAppId, back4appJsKey);
    Parse.serverURL = "https://parseapi.back4app.com/";

    if (Parse.User.current() !== null) {
        currentUser = Parse.User.current();
        userLoggedIn = true;
        $('#menuOpenWrapper').show();
        $('#usernameMenu').html('Hello, ' + "<span id='usernameSpan'>" + capitalize(currentUser.get("username")) + "</span>");
        $('#user').hide();

        chosenMoviesArr = currentUser.get("objects");;
        chosenTvShowsArr = currentUser.get("tvObject");;
    }

    $(document).on('click touchend', (e) => {
        if ($('#menu').is(':visible')) {
            if (!$(e.target).is("#menuOpenWrapper, #menu, .menuSpan, #toggle")) {
                $('#toggle').attr('class', '');
            } 
        }
    });
});

const goToSignUp = () => {

    $('.bottomSection').hide();

    page = 3;

    $('body').css('pointer-events', 'none');
    $('.imgDateWrapper, .bottomSection, #container, #switchContentBtnWrapper, .btnWrapper, .inputWrapper, #user').hide();
    $('#searchMovie').val('');
    $('.playingNowWrapper, .upcomingMovieWrapper, .movieImg').remove();

    $('#mainContent, .searchContainer').hide();
    $('.logo').css('cursor', 'pointer');

    $('html, body').css({'background': 'url(./images/background.jpg) no-repeat center center fixed', 'background-size': 'cover'});

    $.get("signUpForm.html", (data) => {
        $('#userWrapper').show();
        $('#userWrapper').append(data);
        setTimeout(() => {
            $('body').css('pointer-events', 'all');

            $('#popularPeopleWrapper').empty().hide();

            if (lang == 'he') {
                $('#usernameSignUp').attr('placeholder', 'שם משתמש');
                $('#usernameSignIn').attr('placeholder', 'שם משתמש');
                $('#emailSignUp').attr('placeholder', 'אימייל');
                $('#passwordSignUp').attr('placeholder', 'סיסמה');
                $('#passwordSignIn').attr('placeholder', 'סיסמה');
                $('.signUpButton').html('הירשם');
                $('#showSignInFormBtn').html('התחבר');
                $('#showSignUpFormBtn').html('צור חשבון');
                $('.logInDesc').html('כבר יש לך חשבון?');
                $('#emailMessage').html('את/ה תקבל/י אימייל אישור');
                $('#forgotPass').html('שכחת סיסמה?');
                $('#forgotPassBtn').html('לחץ כאן');
                $('#passErrorSignIn').html('הסיסמה מכילה פחות מ 6 תווים');
                $('#emailForgotPass').attr('placeholder', 'אימייל');
                $('#backToSignInFormBtn').attr('placeholder', 'התחבר');
                $('#emailWasSent').attr('placeholder', 'תבדוק/י את תיבת המייל');
            } else {
                $('#usernameSignUp').attr('placeholder', 'Username');
                $('#emailSignUp').attr('placeholder', 'Email');
                $('#passwordSignUp').attr('placeholder', 'Password');
                $('.signUpButton').html('Sign In');
                $('#showSignInFormBtn').html('Log In');
                $('.logInDesc').html('Already Have An Account?');
                $('#emailMessage').html('You Will Receive A Confirmation Email');
                $('#usernameSignIn').attr('placeholder', 'Username');
                $('#passwordSignIn').attr('placeholder', 'Password');
                $('#showSignUpFormBtn').html('Sign In');
                $('#forgotPass').html('Fogot Password');
                $('#forgotPassBtn').html('Click Here');
                $('#passErrorSignIn').html('Password Is Less Than 6 Characters');
                $('#emailForgotPass').attr('placeholder', 'Email');
                $('#backToSignInFormBtn').attr('placeholder', 'Log In');
                $('#emailWasSent').attr('placeholder', 'Please Check Your Email');
            }

        }, 1000);
    });
}

const showSignInForm = () => {

    $('#signInSection').show();
    $('#signUpSection, #forgotPassSection').hide();

    $('.bottomSection').hide();

    if (lang == 'he') {
        $('.logInDesc').html('אין לך חשבון?');
        $('.signUpButton').html('התחבר');

    } else {
        $('.signUpButton').html('Log In');
        $('.logInDesc').html("Don't Have An Account?");
    }
}

const showSignUpForm = () => {
    $('#signUpSection').show();
    $('#signInSection').hide();

    $('.bottomSection').hide();

    if (lang == 'he') {
        $('.logInDesc').html('כבר יש לך חשבון?');
        $('.signUpButton').html('הירשם');

    } else {
        $('.logInDesc').html('Already Have An Account?');
        $('.signUpButton').html('Sign In');
    }
}

const showResetPassForm = () => {
    $('#forgotPassSection').show();
    $('#signInSection').hide();

    $('.bottomSection').hide();
}

const signUp = () => {

    valid = true;

    let nameVal = $('#usernameSignUp').val();
    let emailVal = $('#emailSignUp').val();
    let passwordVal = $('#passwordSignUp').val();

    let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (nameVal == '' || nameVal.length < 2) {
        $('#usernameSignUp').css({
            'border': '1px solid #FF4545'
        });
        valid = false;
    }
    
    if (emailVal == '' || emailVal == undefined || emailVal == 0 || !filter.test(emailVal)) {
        $('#emailSignUp').css({
            'border': '1px solid #FF4545'
        });
        valid = false;
    }

    if (passwordVal == '' || passwordVal.length < 6) {
        $('#passwordSignUp').css({
            'border': '1px solid #FF4545'
        });

        $('body').css('pointer-events', 'none');
        $('#passErrorSignIn').fadeIn();

        setTimeout(() => {
            $('body').css('pointer-events', 'all');
            $('#passErrorSignIn').fadeOut();
        }, 2000);

        valid = false;
    }

    if (valid) {

        if (Parse.User.current() !== null) {
            Parse.User.logOut();
        }

        localStorage.clear();
        var user = new Parse.User();

        currentUser = user;

        user.set("username", nameVal);
        user.set("password", passwordVal);
        user.set("email", emailVal);
        user.set("objects", chosenMoviesArr);
        user.set("tvObject", chosenTvShowsArr);
        
        user.signUp().then((user) => {
            showSignInForm();

        }).catch((error) => {
            console.log("Error: " + error.code + " " + error.message);
        });
    }
}

const logIn = () => {

    valid = true;

    let nameVal = $('#usernameSignIn').val();
    let passwordVal = $('#passwordSignIn').val();

    if (nameVal == '' || nameVal.length < 2) {
        $('#usernameSignIn').css({
            'border': '1px solid #FF4545'
        });
        valid = false;
    }
    
    if (passwordVal == '' || passwordVal.length < 6) {
        $('#passwordSignIn').css({
            'border': '1px solid #FF4545'
        });

        $('body').css('pointer-events', 'none');

        if (lang == 'he') {
            $('#passErrorLogIn').html('Please Must Be At Least 6 Characters'); 
        } else {
            $('#passErrorLogIn').html('אנא הזן/הזיני לפחות 6 תווים');
        }

        $('#passErrorLogIn').fadeIn();

        setTimeout(() => {
            $('body').css('pointer-events', 'all');
            $('#passErrorLogIn').fadeOut();
        }, 2000);

        valid = false;
    }

    if (valid) {

        $('#spinner').fadeIn('fast');
        $('body').css('pointer-events', 'none');
        $('body').css('opacity', '.5');

        localStorage.clear();

        var user = Parse.User.logIn(nameVal, passwordVal).then((user) => {
            currentUser = user;

            chosenMoviesArr = user.get("objects");;
            chosenTvShowsArr = user.get("tvObject");;
            
            $('body').css('pointer-events', 'none');
            $('#user').hide();
            $('#usernameMenu').html('Hello, ' + "<span id='usernameSpan'>" + capitalize(currentUser.get("username")) + "</span>");

            userLoggedIn = true;
  
            goHome();

            setTimeout(() => {
                $('#spinner').hide();
                $('body').css({'pointer-events': 'all', 'opacity': 1});
            }, 1000);

        }).catch((error) => {

            $('#spinner').hide();
            $('body').css({'pointer-events': 'all', 'opacity': 1});

            if (error.code == 205) {

                if (lang == 'he') {
                    $('.signUpButton').html('בבקשה אשר/י את האימייל שלך');
                } else {
                    $('.signUpButton').html('Please Verify Your Email');          
                }

                $('.signUpButton').css({'color': 'red', 'background': 'white'});

                setTimeout(() => {

                    if (lang == 'he') {
                        $('.signUpButton').html('התחבר');
                    } else {
                        $('.signUpButton').html('Log In');
                    }
                    $('.signUpButton').css({'color': 'white', 'background': 'linear-gradient(#333, #222)'});
                }, 2000);
            } else if (error.code == 101) {

                if (lang == 'he') {
                    $('.signUpButton').html('בדוק/בדקי שם משתמש / סיסמה');
                } else {
                    $('.signUpButton').html('Check Username/Password');
                }

                $('.signUpButton').css({'color': 'red', 'background': 'white'});

                setTimeout(() => {

                    if (lang == 'he') {
                        $('.signUpButton').html('התחבר');
                    } else {
                        $('.signUpButton').html('Log In');
                    }
                    $('.signUpButton').css({'color': 'white', 'background': 'linear-gradient(#333, #222)'});
                }, 2000);
            } else {
                console.log("Error: " + error.code + " " + error.message);
            }
        }); 
    }
}

const logOut = () => {

    localStorage.clear();

    var user = Parse.User.logOut().then((user) => {
        currentUser = user;
        chosenMoviesArr = [];
        chosenTvShowsArr = [];

        $('.addToFavoritesBtn').remove();
        $('#menuOpenWrapper').hide();
        $('#user').show();

        userLoggedIn = false;
    });

    if(page !== 0) {
        goHome();
    }
}

const resetPassword = () => {

    valid = true;

    let emailVal = $('#emailForgotPass').val();

    let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (emailVal == '' || emailVal == undefined || emailVal == 0 || !filter.test(emailVal)) {
        $('#emailForgotPass').css({
            'border': '1px solid #FF4545'
        });
        valid = false;
    }

    if (valid) {

        Parse.User.requestPasswordReset(emailVal).then(() => {
            $('#emailWasSent').fadeIn();

            setTimeout(() => {
                $('#emailWasSent').fadeOut();
                showSignInForm();
            }, 2000); 
        }).catch((error) => {
            console.log("The login failed with error: " + error.code + " " + error.message);
        });
    }
}

const addToFavorites = (object, type, elem) => {

    if (lang == 'he') {
        $('#addToFavorites').html('הוסר מהמועדפים');
    } else {
        $('#addToFavorites').html('Removed From Favorites');
    }

    let finalArr;

    let finalColumn;

    if(type == 1) {
        finalArr = chosenMoviesArr;
        finalColumn = 'objects';
    } else {
        finalArr = chosenTvShowsArr;
        finalColumn = 'tvObject';
    }

    if (finalArr.includes(object)) {
        let index = finalArr.indexOf(object);
        finalArr.splice(index, 1);
        currentUser.set(finalColumn, finalArr).save();
        if (page == 4) {
            $(elem).parent().remove();
        }

        $('#addToFavorites').show();
        $('body').css('pointer-events', 'none');
        setTimeout(() => {
            $('body').css('pointer-events', 'all');
            $('#addToFavorites').hide();
        }, 2000);
    } else {
        finalArr.push(object);

        currentUser.set(finalColumn, finalArr).save();

        if (lang == 'he') {
            $('#addToFavorites').html('נוסף למועדפים');
        } else {
            $('#addToFavorites').html('Added To Favorites');
        }

        $('#addToFavorites').show();
        $('body').css('pointer-events', 'none');
        setTimeout(() => {
            $('body').css('pointer-events', 'all');
            $('#addToFavorites').hide();
        }, 2000);
    }
}

const showFavorites = (type) => {

    if (chosenMoviesArr.length == 0 && chosenTvShowsArr.length == 0) {
        $('#noFavoritesPop').show();
        return; 
    }

    $('#chosenMovie').attr('chosenId', '');

    window.history.pushState({ "html": location.href, "pageTitle": location.href.pageTitle }, "", location.href.split("?")[0]);

    if (page == 5) {
        $('#myAccountWrapper').empty().hide();
        if (darkMode) {
            $('html, body').css({'background': '#323538'});
        } else {
            $('html, body').css({'background': 'unset'});
        }
        $('.inputWrapper').show();
        $('#container').show();
    }

    if (page == 4) {
        return;
    } else {
        page = 4;

        $('.chosenMovieSection').empty();
        $('#chosenMovieTitle').remove();
        $('#chosenMovie').hide();
        $('#container').removeClass('singleMovieContainer');
        $('#searchMovie').val('');

        $('.logo').css('cursor', 'pointer');

        let objects;
        let finalClass;

        if (type == 1) {
            objects = currentUser.get("objects");
            finalClass = 'favoriteWrapper';
        } else {
            objects = currentUser.get("tvObject");
            finalClass = 'favoriteWrapper tvFav';
        }
    
        $('.movieWrapper, .playingNowWrapper, .btnWrapper').remove();

        $('#popularPeopleWrapper').empty().hide();

        $('#switchContentBtn, #switchContentBtn2, #switchContentBtn3').hide();
    
        let btnWrapper = $('<div>', {
            class: 'btnWrapper btnWrapperFavorites'
        }).appendTo('#switchContentBtnWrapper');
    
        $('#switchContentBtnWrapper, .bottomSection').show();

        let finalDateText;
        let finalNameText;
        let finalFavHeader;
        let finalTypeText;
    
        if (lang == 'he') {
            finalDateText = 'סדר לפי תאריך';
            finalNameText = 'סדר לפי שם';
            finalFavHeader = 'המועדפים שלך';
            if (type == 1) {
                finalTypeText = 'סדרות';
            } else {
                finalTypeText = 'סרטים';
            }
    
        } else {
            finalDateText = 'Sort By Date';
            finalNameText = 'Sort By Name';
            finalFavHeader = 'Your Favorites';
            if (type == 1) {
                finalTypeText = 'Tv Shows';
            } else {
                finalTypeText = 'Movies';
            }
        }
    
        $('#currentHeader').html(finalFavHeader);

        if (chosenTvShowsArr.length !== 0) {
            let movieTvShowBtn = $('<button>', {
                class: 'movieTvShowBtn',
                text: finalTypeText,
                click: () => {
    
                    page = -1;
    
                    $('#contentWrapper').css({'pointer-events': 'none', 'opacity': .5});
                    $('html').css('overflow-y', 'hidden');  
                    $('#spinner').fadeIn('fast');
    
                    $('.favoriteWrapper').remove();
    
                    if (type == 1) {
                        showFavorites(2);
                    } else {
                        showFavorites(1);
                    }
    
                    setTimeout(() => {
                        $('#spinner').hide();
                        $('#contentWrapper').css({'pointer-events': 'all', 'opacity': 1});
                        $('html').css('overflow-y', 'unset'); 
                        window.scrollTo(0, 1);
            
                    }, 500); 
                }
            }).appendTo(btnWrapper);
        }

        let dateSortBtn = $('<button>', {
            class: 'dateSortBtn',
            text: finalDateText,
            click: () => {
                sortMovies('releaseDate', 1, 3);
            }
        }).appendTo(btnWrapper);
    
        let titleSortBtn = $('<button>', {
            class: 'titleSortBtn',
            text: finalNameText,
            click: () => {
                sortMovies('movieTitle', 2, 3)
            }
        }).appendTo(btnWrapper);

        let finalUrl;

        if (type == 1) {
            finalUrl = movieInfoUrl;
        } else {
            finalUrl = tvShowInfoUrl;
        }
    
        for (let i = 0; i < objects.length; i++) {

            $.ajax({
                type: 'GET',
                crossDomain: true,
                url: finalUrl + objects[i] + "?api_key=" + tmdbKey + '&language=' + lang,
                dataType: "json",
                success: (data) => {
    
                    let todayDate = new Date();
    
                    try {
                        
                        data.vote_average = JSON.stringify(data.vote_average);
    
                        let finalVoteText;
    
                        if ((data.vote_average.length == 1 && data.vote_average !== '0') || data.vote_average == '10') {
                            finalVoteText = data.vote_average + '0'
                        } else {
                            finalVoteText = data.vote_average;
                        }
    
                        finalVoteText = finalVoteText.replace('.', '') + '%';
                        
                        if (finalVoteText == '0%' && JSON.stringify(data.release_date > todayDate)) {
                            finalVoteText = 'TBD';
                        }
    
                        var path = data.poster_path;

                        let finalTitle;
                        let finalOriginalTitle;

                        if (type == 1) {
                            finalTitle = data.title;
                            finalOriginalTitle = data.original_title;
                        } else {
                            finalTitle = data.name;
                            finalOriginalTitle = data.original_name;
                        }
    
                        title = finalTitle;
                        originalTitle = finalOriginalTitle;

                        movieImage = data.backdrop_path;
                        movieId = data.id;
                        var tmdbPathPosterPath = 'https://image.tmdb.org/t/p/w1280' + path;
                        var tmbdBackdropPath = 'https://image.tmdb.org/t/p/w1280' + movieImage;
    
                        let finalReleaseDate;

                        if (type == 1) {
                            finalReleaseDate = data.release_date;
                        } else {
                            finalReleaseDate = data.first_air_date;
                        }
    
                        let finalDate;
    
                        if (finalReleaseDate == '') {
                            finalDate = 'No Release Date';
                        } else {
                            let readDate = new Date(finalReleaseDate);
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
    
                        wrapper = $('<div>', {
                            class: finalClass,
                            value: movieId,
                            backdropSrc: tmbdBackdropPath,
                            releaseDate: finalReleaseDate,
                            movieTitle: title,
                            originalTitle, originalTitle
                        }).appendTo($('#container'));
    
                        let addToFavoritesBtn = $('<img>', {
                            class: 'addToFavoritesBtn',
                            src: './images/fullStar.png',
                            alt: 'star',
                            click: function() {
                                if ($(this).attr('src') == './images/emptyStar.png') {
                                    $(this).attr('src', './images/fullStar.png');
                                } else {
                                    $(this).attr('src', './images/emptyStar.png');
                                }
    
                                addToFavorites(Number($(this).parent().attr('value')), type , $(this));
                            }
                        }).appendTo($(wrapper));
    
                        let finalName;
    
                        if (title.length > 40) {
                            finalName = title.substring(40, 0) + '...';
                            $(wrapper).addClass('longNameWrapper');
                        } else {
                            finalName = title;
                        }
    
                        var movieTitle = $('<p>', {
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
                                        $(this).css('opacity', '.5');
                                        $(this).parent().find('.movieFullNameWrapper').fadeIn();
                                    }
                                );
                
                                $(wrapper).hover(
                                    function() {
                
                                    }, function() {
                                        $(this).find($('.longName')).css('opacity', '1');
                                        $(this).find('.movieFullNameWrapper').fadeOut();
                                    }
                                );
                            }   
                        }
    
                        let imgDateWrapper = $('<div>', {
                            class: 'imgDateWrapper',
                            click: function () {
                                objectClicked($(this).parent().attr('value'), $(this).parent().attr('movieTitle'), $(this).parent().attr('originalTitle'), type);
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
    
                        var img = $('<img>', {
                            class: 'movieImg',
                            alt: 'movieImg',
                            src: tmdbPathPosterPath
                        }).appendTo(imgDateWrapper);
               
                    } catch (error) {
                        
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

                        if ($(window).width() > 765) {
                            hoverEffect($('.favoriteWrapper'))
                        }
                    }, 1000)
                },
                error: (err) => {
                    //console.log(err);
                }
            })
        }
    }
}

const goToMyAccount = () => {

    $('#chosenMovie').attr('chosenId', '');

    if (page == 5) {
        return;
    } else {
        if (page == 4) {
            $('.favoriteWrapper').remove();    
        }
    
        page = 5;
        $('.logo').css('cursor', 'pointer');
        $('body').css('pointer-events', 'none');
        $('.imgDateWrapper, .bottomSection, #container, #switchContentBtnWrapper, .btnWrapper, .inputWrapper').hide();
        $('#searchMovie').val('');
        $('.playingNowWrapper, .upcomingMovieWrapper, .movieImg').remove();
    
        $('#popularPeopleWrapper').empty().hide();

        $('html, body').css({'background': 'url(./images/background.jpg) no-repeat center center fixed', 'background-size': 'cover'});
    
        $.get("myAccount.html", (data) => {
            $('#myAccountWrapper').show();
            $('#myAccountWrapper').append(data);
            setTimeout(() => {
                $('body').css('pointer-events', 'all');
                if (lang == 'he') {
                    $('#usernameAccount').attr('placeholder', 'שם משתמש');
                    $('.signUpButton, #usernameAccountLbl').html('שנה שם משתמש');
                } else {
                    $('#usernameAccount').attr('placeholder', 'Username');
                    $('.signUpButton, #usernameAccountLbl').html('Change Username');
                }
            }, 1000);
        });
    }
}

const openUsernamePop = () => {
    valid = true;

    let usernameAccountVal = $('#usernameAccount').val();

    if (usernameAccountVal == '' || usernameAccountVal.length < 2) {
        $('#usernameAccount').css({
            'border': '1px solid #FF4545'
        });
        valid = false;
    }

    if (valid) {
        $('#prevName').html(currentUser.get('username'));
        $('#nextName').html(usernameAccountVal);
        $('#changeUsernamePop').show();
    }
}

const changeUsername = () => {

    valid = true;

    let usernameAccountVal = $('#usernameAccount').val();

    if (usernameAccountVal == '' || usernameAccountVal.length < 2) {
        $('#usernameAccount').css({
            'border': '1px solid #FF4545'
        });
        valid = false;
    }

    if (valid) {
        currentUser.set('username', usernameAccountVal).save();
        $('#userNameHeader').html(capitalize(usernameAccountVal));
        $('#usernameMenu').html('Hello, ' + "<span id='usernameSpan'>" + capitalize(currentUser.get("username")) + "</span>");
        $('#changeUsernamePop').hide();
        goHome();
    }
}