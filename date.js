//   FOR EXPORTING SOME OTHER FUNCTION
//   module.exports.functionName = function(){};
  
   
    //EXPORTING THE FUNCTION AS MODULE
    //FUNCTION IS ANONYMOUS HAVING NO NAME BUT A VAR ASSIGNED 

    exports.getDate = function () {

     //GETTING THE DAY OF THE WEEK AND COMPARING

      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const today  = new Date();
      return today.toLocaleDateString("en-UK", options); // Saturday, September 17, 2016

  }
  

  console.log(module.exports.getDate);