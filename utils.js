module.exports = {

  random : function ( min, max ){
    return Math.floor( Math.random() * ( max - min + 1 )) + min;
  },

  uid : function ( len ){
    var str     = '';
    var src     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var i       = len;

    for( ; i-- ; ){
      str += src.charAt( this.random( 0, src.length - 1 ));
    }

    return str;
  }
};