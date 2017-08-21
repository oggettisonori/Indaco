function addCookie(name,value,expiresHours){
    if (name.indexOf('-comment')!=-1){
        note_d=value;
    }
    else {
        supported=value;
    }}
function JSONParser(feature_title,feature_category){

    var platform=localStorage.getItem('platform');
    var version=localStorage.getItem('version');
    var note_t='Not Test';
    switch(supported){
        case "y":
            note_t = 'Supported';
            break;
        case "n":
            note_t = 'Not Supported';
            break;
        case "p":
            note_t = 'Partially Supported';
        }

    console.log('platform:'+platform);
    console.log('note_t:'+note_t);
    console.log('version:'+version);
    console.log('note_d:'+note_d);
    console.log('supported:'+supported);
    console.log('feature_title:'+feature_title);
    console.log('feature_category:'+feature_category);

    var r_url = "/save_data?platform=" + platform + "&version=" + version + "&note_d=" + note_d + "&supported=" + supported + "&case_name=" + feature_title + "&type=" + feature_category+ "&note_t=" + note_t;
                $.ajax({
                    url:r_url,
                    type:"GET",
                    data:'',
                    success : function(data) {
                        if (data=='success'){
                        	console.log('Save data succeed!');
                        }
                        else{
                            alert('Save data failed!');
                        }
                    },
                    error : function() {
                        alert('Save data failed,please contact admin!');
                    }
                });
}
			
