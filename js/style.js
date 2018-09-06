$(function() {
    /**
     * 通过数组id获取地址列表数组
     */
    function getAddrsArrayById(id) {
        var results = [];
        if (addr_arr[id] != undefined)
            addr_arr[id].forEach(function(subArr) {
                results.push({
                    key: subArr[0],
                    val: subArr[1]
                });
            });
        else {
            return;
        }
        return results;
    }
    /**
     * 通过开始的key获取开始时应该选中开始数组中哪个元素
     */
    function getStartIndexByKeyFromStartArr(startArr, key) {
        var result = 0;
        if (startArr != undefined)
            startArr.forEach(function(obj, index) {
                if (obj.key == key) {
                    result = index;
                    return false;
                }
            });
        return result;
    }

    //bind the click event for 'input' element
    $("#jg").click(function() {
        var PROVINCES = [],
            startCities = [],
            startDists = [];
        //Province data，shall never change.
        addr_arr[0].forEach(function(prov) {
            PROVINCES.push({
                key: prov[0],
                val: prov[1]
            });
        });
        //init other data.
        var $input = $(this),
            dataKey = $input.attr("data-key"),
            provKey = 1, //default province 北京
            cityKey = 36, //default city 北京
            distKey = 37, //default district 北京东城区
            distStartIndex = 0, //default 0
            cityStartIndex = 0, //default 0
            provStartIndex = 0; //default 0

        if (dataKey != "" && dataKey != undefined) {
            var sArr = dataKey.split("-");
            if (sArr.length == 3) {
                provKey = sArr[0];
                cityKey = sArr[1];
                distKey = sArr[2];

            } else if (sArr.length == 2) { //such as 台湾，香港 and the like.
                provKey = sArr[0];
                cityKey = sArr[1];
            }
            startCities = getAddrsArrayById(provKey);
            startDists = getAddrsArrayById(cityKey);
            provStartIndex = getStartIndexByKeyFromStartArr(PROVINCES, provKey);
            cityStartIndex = getStartIndexByKeyFromStartArr(startCities, cityKey);
            distStartIndex = getStartIndexByKeyFromStartArr(startDists, distKey);
        }
        var navArr = [{//3 scrollers, and the title and id will be as follows:
            title: "省",
            id: "scs_items_prov"
        }, {
            title: "市",
            id: "scs_items_city"
        }, {
            title: "区",
            id: "scs_items_dist"
        }];
        SCS.init({
            navArr: navArr,
            onOk: function(selectedKey, selectedValue) {
                $input.val(selectedValue).attr("data-key", selectedKey);
            }
        });
        var distScroller = new SCS.scrollCascadeSelect({
            el: "#" + navArr[2].id,
            dataArr: startDists,
            startIndex: distStartIndex
        });
        var cityScroller = new SCS.scrollCascadeSelect({
            el: "#" + navArr[1].id,
            dataArr: startCities,
            startIndex: cityStartIndex,
            onChange: function(selectedItem, selectedIndex) {
                distScroller.render(getAddrsArrayById(selectedItem.key), 0); //re-render distScroller when cityScroller change
            }
        });
        var provScroller = new SCS.scrollCascadeSelect({
            el: "#" + navArr[0].id,
            dataArr: PROVINCES,
            startIndex: provStartIndex,
            onChange: function(selectedItem, selectedIndex) { //re-render both cityScroller and distScroller when provScroller change
                cityScroller.render(getAddrsArrayById(selectedItem.key), 0);
                distScroller.render(getAddrsArrayById(cityScroller.getSelectedItem().key), 0);
            }
        });
    });

    //提交验证
    var sureTj = $('.sure-tj'),
        name = $('.name').val(),
        sex = $('input[name=man]'),
        date = $('#date').val(),
        sx = $('#select option').val(),
        tel = $('.tel').val(),
        workadr = $('.gzdw').val(),
        zw = $('.zw').val(),
        homeadr = $('.adress').val(),
        jl = $('#jl').val(),
        ldqk = $('#ldqk').val(),
        father = $('.father').val(),
        mother = $('.mother').val(),
        grandfa = $('.grandfa').val(),
        grandmo = $('.grandmo').val(),
        wife = $('.wife').val(),
        jg = $('.jg').val(),
        zw1 = $('.zw1').val(),
        child = $('.child'),
        girl = $('.girl'),
        namexp = $('.namexp'),
        dw1 = $('.dw1');
    sureTj.on('click',function(){
        var ainp = $('#form ul li').find('input');
        var sexVal = '';
        var nameYz = /^[\u4e00-\u9fa5]{0,}$/;//验证姓名，只能是中文
        var telYz = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;//验证手机号
        var adrYz = /^[\u4E00-\u9FA50-9]+$/;//验证地址

        if(telYz.test(tel) === false){
            alert('请输入正确的手机号码！(11位数字)');
            return false;
        }
        namexp.each(function(){
            if(nameYz.test($(this).val()) === false){
                alert('姓名只能是中文字符！'+ $(this).val());
                return false;
            }
        });
        if(adrYz.test(dw1.val()) === false){
            alert('地址只能是中文，数字！'+ $(this).val());
            return false;
        }
        function yz(){
            ainp.each(function(){
                if($(this).val() === ''){
                    alert($(this).siblings('span').text() + '不能为空！');
                    return false;
                }
            });
            if(sex.is(':checked')){
                sexVal = $(this).val();
            }else{
                alert('请选择性别！');
                return false;
            }
            if(sx === '请选择'){
                alert('请选择属相！');
                return false;
            }
            if(date === ''){
                alert('请选择出生日期！');
                return false;
            }
            if(jg === ''){
                alert('请选择籍贯！');
                return false;
            }
        }
        yz();
    })
});