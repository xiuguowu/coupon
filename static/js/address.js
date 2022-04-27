function init(_data, _target){
  var _address = [];
  var _provinces = [];
  var _city = [];
  var _districts = [];
  var addressIndex = _target.data.addressIndex;
  for (var i in _data.provinces) {
    var provinces = _data.provinces[i];
    _provinces.push(provinces.name);
  }

  addressIndex = addressIndex ? addressIndex : [0,0,0];
  var city = _data.citys[_data.provinces[addressIndex[0]].code]
  for (var i in city) {
    if (city[i].name == '市辖区') {
      _city.push(_data.provinces[addressIndex[0]].name);
    } else {
      _city.push(city[i].name);
    }

  }

  var districts = _data.districts[city[addressIndex[1]].code];
  for (var i in districts) {
    _districts.push(districts[i].name);
  }
  _address.push(_provinces);
  _address.push(_city);
  _address.push(_districts);
  var _paramData = { addressIndex: addressIndex, addressinfo: _address, addressObject: _data};
  _target.setData(_paramData);
}

function chooseHandler(index,_target){
 var _data =  _target.data.addressObject;
  var _provinces = _data.provinces[index[0]];
  var citys = _data.citys[_provinces.code];
  var _city = citys[index[1]];
  var districts = _data.districts[_city.code];
  var _district = districts[index[2]];
  var name = _provinces.name + "," + _city.name + "," + _district.name;
  if (_city.name == '市辖区'){
    name = _provinces.name + "," + _district.name;
  }
  var code = _provinces.code + "," + _city.code + "," + _district.code;
  var data = { addressCode: code, addressName: name};
  _target.setData(data);
}

module.exports = {
  init: init,
  chooseHandler: chooseHandler
}