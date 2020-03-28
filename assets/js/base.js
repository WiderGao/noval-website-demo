function NovalManager() {
    this.novalListSize = 40;
    this.chapterListSize = 48;
    this.baseUrl = '//12138.site:666/';
    this.currentPage = 1;
    this.currentNoval;
    this.currentChapter;
    function checkData(data) {
        if(data.mes.length == 0)
            return data.data;
        else {
            alert('数据加载失败：'+data.mes);
            return data.data;
        }
    }
    $.ajaxSettings.async = false;
    this.setCurrentNoval = function(novalId) {
        this.currentNoval = novalId;
    }
    this.setCurrentChapter = function(chapterId) {
        this.currentChapter = chapterId;
    }
    this.getNovalList = function(pageNum) {
        var result;
        $.ajax({
            type: 'GET',
            url: this.baseUrl + 'getNovelList/',
            dataType: 'json',
            data: {
                page : pageNum,
                size : this.novalListSize
            },
            success: function(data) {
                result = checkData(data);
            }
        });
        return result;
    }
    this.getChapterList = function(pageNum) {
        var result;
        $.ajax({
            type: 'GET',
            url: this.baseUrl + 'getChapterList/' + this.currentNoval,
            dataType: 'json',
            data: {
                // page: pageNum,
                // size: this.chapterListSize
            },
            success: function(data) {
                result = checkData(data);
            }
        });
        return result;
    }
    this.getTotalPageNum = function() {
        var result;
        $.ajax({
            type: 'GET',
            url: this.baseUrl + 'getNovelList/',
            dataType: 'json',
            success: function(data) {
                result = checkData(data);
            }
        });
        return Math.ceil(result.length/this.novalListSize);
    }
    this.getChapter = function() {
        var result;
        $.ajax({
            type: 'GET',
            url: this.baseUrl + 'getChapter/' + this.currentChapter,
            dataType: 'json',
            success: function(data) {
                result = checkData(data);
            }
        });
        return result;
    }
    this.getPrevChapter = function() {
        var result;
        $.ajax({
            type: 'GET',
            url: this.baseUrl + 'previous/' + this.currentChapter,
            dataType: 'json',
            success: function(data) {
                result = checkData(data);
            }
        });
        return result;
    }
    this.getNextChapter = function() {
        var result;
        $.ajax({
            type: 'GET',
            url: this.baseUrl + 'next/' + this.currentChapter,
            dataType: 'json',
            success: function(data) {
                result = checkData(data);
            }
        });
        return result;
    }
    this.searchNovalList = function(str) {
        str = str.replace(/\s*/g,"");
        var reg = new RegExp(['',...str,''].join('.*'));
        var result = [];
        $.ajax({
            type: 'GET',
            url: this.baseUrl + 'getNovelList/',
            dataType: 'json',
            success: function(data) {
                var novalList = checkData(data);
                for(var i in novalList) {
                    if(reg.test(novalList[i].name) || reg.test(novalList[i].author))
                    result.push(novalList[i]);
                }
            }
        });
        return result;
    }
    this.searchChapterList = function(str) {
        str = str.replace(/\s*/g,"");
        var reg = new RegExp(['',...str,''].join('.*'));
        var result = [];
        $.ajax({
            type: 'GET',
            url: this.baseUrl + 'getChapterList/' + this.currentNoval,
            dataType: 'json',
            success: function(data) {
                var chapterList = checkData(data);
                for(var i in chapterList) {
                    if(reg.test(chapterList[i].title))
                    result.push(chapterList[i]);
                }
            }
        });
        return result;
    }
}
var noval = new NovalManager();

function scrollTop() {
    $("html").animate({scrollTop:0},400,'swing')
}
function setCookie(cname,cvalue,exdays)
{
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return undefined;
}
function showAllNovalList(page = 1) {
    noval.currentPage = page;
    var data = noval.getNovalList(page);
    $('.article-content').empty().append('<ul></ul>')
    var list = $('.article-content').children('ul');
    for(var i in data) {
        var item = $('<li><div class="noval-item"><p class="name">' + data[i].name + '</p><p class="author"><i class="iconfont icon-author"></i>' + data[i].author + '</p><p class="chapter-number"><i class="iconfont icon-static"></i>' + data[i].chapterNumbers + '</p></div></li>');
        item.attr('onclick', 'showChapterPage(' + data[i].id + ')');
        list.append(item);
    }
}
function showSelectedNovalList(data) {
    $('.article-content').empty().append('<ul></ul>')
    var list = $('.article-content').children('ul');
    for(var i in data) {
        var item = $('<li><div class="noval-item"><p class="name">' + data[i].name + '</p><p class="author"><i class="iconfont icon-author"></i>' + data[i].author + '</p><p class="chapter-number"><i class="iconfont icon-static"></i>' + data[i].chapterNumbers + '</p></div></li>');
        item.attr('onclick', 'showChapterPage(' + data[i].id + ')');
        list.append(item);
    }
}
function showAllChapterList(page = 1) {
    var data = noval.getChapterList(page);
    $('.sidebar-content').append('<ul></ul>')
    var list = $('.sidebar-content').children('ul');
    for(var i in data) {
        var item = $('<li><div class="chapter-item"><p>' + data[i].title + '</p></div></li>');
        item.attr('onclick', 'showContent(' + data[i].id + ')');
        list.append(item);
    }
}
function showSelectedChapterList(data) {
    $('.sidebar-content').empty().append('<ul></ul>')
    var list = $('.sidebar-content').children('ul');
    for(var i in data) {
        var item = $('<li><div class="chapter-item"><p>' + data[i].title + '</p></div></li>');
        item.attr('onclick', 'showContent(' + data[i].id + ')');
        list.append(item);
    }
}
function showPager(total) {
    var total = total || noval.getTotalPageNum();
    var pager = $('.pager').empty();
    pager.show();
    if(total < 9) {
        for(var i = 1; i <= total; i++) {
            if(i != noval.currentPage) {
                var span = $('<span>' + i + '</span>');
                pager.append(span);
                span.attr('onclick','showNovalPage(' + i + ')');
            } else {
                pager.append('<span class="current-page">' + i + '</span>');
            }
        }
    }
    else {
        if(noval.currentPage <= 4) {
            for(var i = 1; i <= 9; i++) {
                if(i != noval.currentPage) {
                    var span = $('<span>' + i + '</span>');
                    pager.append(span);
                    span.attr('onclick','showNovalPage(' + i + ')');
                } else {
                    pager.append('<span class="current-page">' + i + '</span>');
                }
            }
        } else if(noval.currentPage >= total - 4) {
            for(var i = total - 8; i<= total; i++) {
                if(i != noval.currentPage) {
                    var span = $('<span>' + i + '</span>');
                    pager.append(span);
                    span.attr('onclick','showNovalPage(' + i + ')');

                } else {
                    pager.append('<span class="current-page">' + i + '</span>');
                }
            }
        } else {
            console.log(noval.currentPage);

            for(var i = noval.currentPage - 4; i<= noval.currentPage + 4; i++) {
                if(i != noval.currentPage) {
                    var span = $('<span>' + i + '</span>');
                    pager.append(span);
                    span.attr('onclick','showNovalPage(' + i + ')');

                } else {
                    pager.append('<span class="current-page">' + i + '</span>');
                }
            }
        }        
    }
    if(noval.currentPage!=1) pager.prepend('<span class="prev-page" onclick="showNovalPage(' + (noval.currentPage-1) + ')"><i class="iconfont icon-prev"></i></span>');
    if(noval.currentPage!=total) pager.append('<span class="next-page" onclick="showNovalPage(' + (noval.currentPage+1) + ')"><i class="iconfont icon-next"></i></span>');
}
function showContent(id, pushState = true) {
    noval.setCurrentChapter(id);
    var data = noval.getChapter();
    $('title').text(data.title);
    var title = $('<h2>' + data.title + '</h2>'),
        content = $('<p>' + data.content + '</p>');
    $('.article-content').animate({top:'100px',opacity:'0'},0);
    $('.article-content').empty().append($('<div class="chapter"></div>').append(title, content));
    $('.article-content').animate({top:'0',opacity:'1'},'slow');

    if(pushState == true){
        var state = {
            type: 'chapter',
            novalId: noval.currentNoval,
            chapterId: noval.currentChapter
        }
        window.history.pushState(state,'','/noval/' + noval.currentNoval + '/chapter/' + noval.currentChapter);
    }
}
function searchNoval() {
    var str = $('#header-search-box').val();
    if(str.length == 0) showNovalPage(noval.currentPage);
    else {
        var data = noval.searchNovalList(str);
        showSelectedNovalList(data);
        $('.pager').hide();
        randomImg();
    }
}
function searchChapter() {
    var str = $('#sidebar-search-box').val();
    var data = noval.searchChapterList(str);
    showSelectedChapterList(data);
}
function showNovalPage(page = 1,pushState = true) {
    $('title').text('藏书阁');
    $('#main').hide();
    $('#sidebar').hide();
    $('#header').fadeIn();
    $('.toolbar').hide();
    $('#header').append('<a class="color-mode" title="" href="javascript:switchColorMode()"><i class="iconfont"></i></a>');
    showAllNovalList(page);
    randomImg();
    showPager();
    if(pushState == true){
        var state = {
            type: 'noval',
            page: page
        }
        window.history.pushState(state,'','/');        
    }
    $('#main').fadeIn('slow');
}
function showChapterPage(id, chapter, pushState = true) {
    $('#main').fadeOut('fats');
    $('#sidebar').fadeIn();
    $('#header').hide();
    $('.pager').hide();
    showToolBar();
    noval.setCurrentNoval(id);
    $('.article-content,.sidebar-content').empty();
    showAllChapterList(id);
    if(!chapter) $('.sidebar-content ul li:first-child').click();
    else showContent(chapter,pushState);
    $('#main').fadeIn('slow');
}
function prevChapter() {
    var prev = noval.getPrevChapter(noval.currentChapter);
    if(prev.length != 0) showContent(prev);
}
function nextChapter() {
    var next = noval.getNextChapter(noval.currentChapter);
    if(next.length != 0) showContent(next);
}
function showToolBar() {
    $('.toolbar').show();
    $('.toolbar .progress span').text('0.0%');
    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop(),
            documentHeidgt = $(document).height(),
            windowHeight = $(window).height();
        var percentage = scrollTop / (documentHeidgt - windowHeight) * 100;
        percentage = percentage.toFixed(1);
        $('.toolbar .progress span').text(percentage + '%');
    })
}
function init() {
    showNovalPage(1);
    autoDark();
}
$(function() {
    init();
    if(window.location.pathname!='/') pathJump();
});


function randomImg() {
    $('#article .noval-item').each(function() {
        $(this).css('background-image','url("/assets/img/bg/'+Math.floor(Math.random()*15+1)+'.jpg")');
    })
}

function switchColorMode() {
    if(getCookie('darkMode')!=1) {//变暗
        setCookie('darkMode','1',1);
        $('link[title="dark"]').attr('href','/assets/css/dark.css');
        $('.color-mode .iconfont').removeClass('icon-moon').addClass('icon-sun').attr('title','明亮模式');
    } else {//变白
        setCookie('darkMode','0',1);
        $('link[title="dark"]').attr('href','');
        $('.color-mode .iconfont').removeClass('icon-sun').addClass('icon-moon').attr('title','深色模式');
    }
}
function autoDark() {
    if(getCookie('darkMode')==undefined){
        if(new Date().getHours()>20 || new Date().getHours()<6) {
            $('link[title="dark"]').attr('href','/assets/css/dark.css');
            $('.color-mode .iconfont').removeClass('icon-moon').addClass('icon-sun').attr('title','明亮模式');
        } else {
            $('link[title="dark"]').attr('href','');
            $('.color-mode .iconfont').removeClass('icon-sun').addClass('icon-moon').attr('title','深色模式');
        }
    } else if(getCookie('darkMode')==0){
        $('link[title="dark"]').attr('href','');
        $('.color-mode .iconfont').removeClass('icon-sun').addClass('icon-moon').attr('title','深色模式');
    } else {
        $('link[title="dark"]').attr('href','/assets/css/dark.css');
        $('.color-mode .iconfont').removeClass('icon-moon').addClass('icon-sun').attr('title','明亮模式');
    }
}
//类似pjax
window.onpopstate = function(event) {
    var state = event.state;
    if(state.type == 'noval') {
        showNovalPage(state.page,false);
    }
    else if(state.type == 'chapter') {
        showChapterPage(state.novalId,state.chapterId,false);
    }
}
function pathJump(){
    var path = window.location.pathname.split('/');
    var novalId,chapterId;
    for(var i in path)
    {
        if(path[i] == 'noval') novalId = path[i+1];
        if(path[i] == 'chapter') chapterId = path[i+1];
    }
    showChapterPage(novalId,chapterId);
}