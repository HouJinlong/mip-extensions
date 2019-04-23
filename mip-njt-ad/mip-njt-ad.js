/**
 * @file mip-njt-ad 组件  mip.nongjitong.com 广告引入
 * @author houjinlong
 */

define(function (require) {

    var customElement = require('customElement').create();

    /**
     * 构造元素，只会运行一次
     */
    customElement.prototype.build = function () {
        // TODO
        var element = this.element;
        var ajaxIps = !!element.getAttribute('ajaxIp')? element.getAttribute('ajaxIp'):'/API/IP.ashx?action=js'
        var ajaxXml = element.getAttribute('ajaxXml') || '/adm/15.xml';
        var ajaxIp = ajaxIps;
        var pagename = element.getAttribute('pagename');
        var ptypeid = element.getAttribute('ptypeid');
        var pcategoryid = element.getAttribute('pcategoryid');
        var adplace = element.getAttribute('adplace');
        var remoteIpInfo = false;

        adplace = adplace ? adplace.split(',') : ['m_b1'];

        loadXml();

        function loadXml() {
            $.ajax({
                type: 'GET',
                url: ajaxXml,
                dataType: 'xml',
                success: function (responsexml) {
                    var isLbs = false;//是否开启地理位置定向策略
                    for (let x in adplace) {
                        $(responsexml).find('adplace').each(function () {
                            if ($(this).find('placeName').text() === adplace[x]) {
                                $(this).find('item').each(function () {
                                    var flag1 = $(this).find('pagename').text().length == 0 || $(this).find('pagename').text().split(",").indexOf(pagename) >= 0;
                                    var flag2 = $(this).find('typeid').text().length == 0 || $(this).find('typeid').text().split(",").indexOf(ptypeid.toString()) >= 0;
                                    var flag3 = $(this).find('categoryid').text().length == 0 || $(this).find('categoryid').text().split(",").indexOf(pcategoryid.toString()) >= 0;
                                    var flag4 = $(this).find('province').text().length > 0 || $(this).find('city').text().length > 0;
                                    if (!!flag1&&!!flag2&&!!flag3&&!!flag4) {
                                        isLbs = true;
                                        return false;
                                    }
                                });
                            }
                        });
                    }
                    if(!!isLbs){
                        loadIp(responsexml);
                    }
                    loadIp(responsexml);
                }
            });
        }
        function loadIp(responsexml) {
            $.ajax({
                type: 'GET',
                url: ajaxIp,
                dataType: 'script',
                success: function () {
                    if (remote_ip_info) {
                        if (remote_ip_info.ret === 1) {
                            for (var i = 0; i < adplace.length; i++) {
                                loadadm(responsexml, remote_ip_info.province, remote_ip_info.city, adplace[i]);
                            }
                        }
                        else {
                            for (var i = 0; i < adplace.length; i++) {
                                loadadm(responsexml, '', '', adplace[i]);
                            }
                        }
                    }
                    else {
                        for (var i = 0; i < adplace.length; i++) {
                            loadadm(responsexml, '', '', adplace[i]);
                        }
                        var errReportStr = '<img src="https://error-report.danongchang.cn/img.aspx?Appname=njtwap&priority=10&Url=' + window.location.href + '&Errcode=njtwap" />';
                        $(errReportStr).appendTo(document.body);
                    }
                },
                error: function (e) {
                    checkAdmIPajax(responsexml);
                    console.warn(e);
                }
            });
        }
        function loadadm(admxml, province, city, placeName) {
            $(admxml).find('adplace').each(function () {
                if ($(this).find('placeName').text() === placeName) {
                    $(this).find('item').each(function () {
                        if (($(this).find('pagename').text() === ''
                        || $(this).find('pagename').text().split(",").indexOf(pagename) >= 0)
                        && ($(this).find('typeid').text() === ''
                        || $(this).find('typeid').text().split(",").indexOf(ptypeid) >= 0)
                        && ($(this).find('categoryid').text() === ''
                        || $(this).find('categoryid').text().split(",").indexOf(pcategoryid) >= 0)
                        && ($(this).find('province').text() === ''
                        || $(this).find('province').text().split(",").indexOf(province) >= 0
                        || province.indexOf($(this).find('province').text()) >= 0)
                        && ($(this).find('city').text() === ''
                        || $(this).find('city').text().split(",").indexOf(city) >= 0
                        || city.indexOf($(this).find('city').text()) >= 0)) {
                            $('#' + placeName).html($(this).find('adcode').text())
                            .css('overflow', 'hidden')
                            .find('img').css({
                                'display': 'block',
                                'max-width': '100%',
                                'margin': '2% auto'
                            });
                            return false;
                        }
                    });
                    return false;
                }
            });
        }
        function checkAdmIPajax(responsexml) {
            for (var i = 0; i < adplace.length; i++) {
                loadadm(responsexml, '', '', adplace[i]);
            }
            var errReportStr = '<img src="https://error-report.danongchang.cn/img.aspx?Appname=njtwap&priority=5&Url=' + window.location.href + '&Errcode=admipajax" />';
            $(errReportStr).appendTo(document.body);
        }
    };
    return customElement;
});