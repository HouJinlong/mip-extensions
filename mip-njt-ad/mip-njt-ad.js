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
        var element = this.element,
        ajaxXml = element.getAttribute('ajaxXml') || '/adm/15.xml',
        ajaxIp = element.getAttribute('ajaxIp') || '/API/IP.ashx?action=js',
        pagename = element.getAttribute('pagename'),
        ptypeid = element.getAttribute('ptypeid'),
        pcategoryid = element.getAttribute('pcategoryid');
        adplace = element.getAttribute('adplace');
        adplace=adplace?adplace.split(','):['m_b1'];
        //判断地址都存在
        if(ajaxXml){
        	 loadXml();
        }
        function loadXml() {
		    $.ajax({
		        type: "GET",
		        url: ajaxXml,
		        dataType: "xml",
		        success: function(responsexml) {
		             if(ajaxIp){
		             	loadIp(responsexml);
		             }else{
		             	checkAdmIPajax(responsexml)
		             }
		        }
		    })
		}
        function loadIp(responsexml){
        	$.ajax({
                type: "GET",
                url: ajaxIp,
                dataType: "script",
                success: function() {
                	var remote_ip_info = {"country":"中国","province":"北京","city":"","district":"","isp":"","type":"","desc":""};
                    if (typeof remote_ip_info !== 'undefined') {
                        admipajaxsuccess = true;
                        if (remote_ip_info.ret == 1) {
                            for (x in adplace) {
                                loadadm(responsexml, remote_ip_info.province, remote_ip_info.city, adplace[x])
                            }
                        } else {
                            for (x in adplace) {
                                loadadm(responsexml, "", "", adplace[x])
                            }
                        }
                    } else {
                        for (x in adplace) {
                            loadadm(responsexml, "", "", adplace[x])
                        }
                        var err_report_str = '<img src="https://error-report.danongchang.cn/img.aspx?Appname=njtwap&priority=10&Url=' + window.location.href + '&Errcode=njtwap" />';
                        $(err_report_str).appendTo(document.body)
                    }
                },
                error: function (e) {
                	checkAdmIPajax(responsexml)
            		console.warn(e)
        		}
            });
        }
        function loadadm(admxml, province, city, placeName) {
		    $(admxml).find('adplace').each(function() {
		    	
		        if ($(this).find('placeName').text() === placeName) {
		            $(this).find('item').each(function() {
		                if (($(this).find('pagename').text() === "" || $(this).find('pagename').text().indexOf(pagename) >= 0) && ($(this).find('typeid').text() === "" || $(this).find('typeid').text().indexOf(ptypeid) >= 0) && ($(this).find('categoryid').text() === "" || $(this).find('categoryid').text().indexOf(pcategoryid) >= 0) && ($(this).find('province').text() === "" || $(this).find('province').text().indexOf(province) >= 0 || province.indexOf($(this).find('province').text()) >= 0) && ($(this).find('city').text() === "" || $(this).find('city').text().indexOf(city) >= 0 || city.indexOf($(this).find('city').text()) >= 0)) {
		                    $("#" + placeName).html($(this).find('adcode').text()).css('overflow', 'hidden').find('img').css({
		                    	'display':'block',
		                    	'max-width':'100%',
		                    	'margin':'2% auto'
		                    });;
		                    return false
		                }
		            });
		            return false
		        }
		    })
		}
        function checkAdmIPajax(responsexml, bodywidth) {
		        for (x in adplace) {
		            loadadm(responsexml, "", "", adplace[x], bodywidth)
		        }
		        var err_report_str = '<img src="https://error-report.danongchang.cn/img.aspx?Appname=njtwap&priority=5&Url=' + window.location.href + '&Errcode=admipajax" />';
		        $(err_report_str).appendTo(document.body)
		}
		
	};

    return customElement;
});
