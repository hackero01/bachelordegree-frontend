function login() {

    
    var email = document.getElementById('email').value;
    var pass = document.getElementById("parola").value;

    jQuery.ajax({
        url: "https://localhost:44388/api/userLogin?email=" + email + "&pass=" + pass + "",
        type: 'post',
        data: { email: email, parola: pass },
        success: function (response) {
            var msg = "";
          
            if (response.statusConectare == "Conectare cu succes") {

                window.localStorage.setItem('nume', response.nume);
                window.localStorage.setItem('prenume', response.prenume);

                window.localStorage.setItem('idUtilizator', response.idUtilizator);
                var userAIDI = localStorage.getItem('idUtilizator');

                window.localStorage.setItem('email', response.email);

                window.localStorage.setItem('id_rol', response.idRol);
                window.localStorage.setItem('adresa', response.adresa);
                window.localStorage.setItem('numarTelefon', response.numarTelefon);
                window.localStorage.setItem('adresa', response.adresa);
                window.localStorage.setItem('parola', response.parola);
                window.localStorage.setItem('numeMaterie', response.numeMaterie);
                window.localStorage.setItem('denumireRol', response.denumireRol);


                
                if (response.idRol == 3) {
                    window.location = "pages/admin/index.html";

                } else if (response.idRol == 2) {
    
                    window.location = "pages/profesor/index.html";
                   
                   

                } else if (response.idRol == 1) {
                
                    window.location = "pages/student/index.html";
                  
                }

                mesajConectare(response);

            } else {
                msg = "Invalid username and password!";
                console.log(msg);
                mesajConectare(response);
            }




        }

    });


}
function countTeacherExams(userAIDI) {
   
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/getNumberOfExamsByIdOfTeacher?idUtilizator=" + userAIDI + "",
        async: false,
        success: function (response) {

           

            jQuery(".counterExam").html(response);

        }
    });
}
function loadMyGradePage() {
    var userAIDI = localStorage.getItem("idUtilizator");
    var idSpecializare = localStorage.getItem("idSpecializareSetatC");
    var anStudiu = localStorage.getItem("anStudiuSetatCBD");
    getStudentGradeById(userAIDI);
    getNumberOfPassedExamByIdOfStudent(userAIDI);
    getStudentFailedExams(userAIDI);
    countTotalGradesById(userAIDI);
}
function loadmygrouppage() {
    var idSpecializare = localStorage.getItem("idSpecializareSetatC");
    var anStudiu = localStorage.getItem("anStudiuSetatCBD")
    getListOfStudentClassById(idSpecializare, anStudiu);
}
function loadmyExamPage() {
    var userAIDI = localStorage.getItem("idUtilizator");
    var idSpecializare = localStorage.getItem("idSpecializareSetatC");
    var anStudiu = localStorage.getItem("anStudiuSetatCBD");
    console.log(userAIDI);
    loadExamListofUserById(userAIDI, idSpecializare, anStudiu);
    countExamByIdOfUser(userAIDI, idSpecializare, anStudiu);
}
function loadIndexOfStudents() {
    var userAIDI = localStorage.getItem("idUtilizator");
    var idSpecializare = localStorage.getItem("idSpecializareSetatC");
    var anStudiu = localStorage.getItem("anStudiuSetatCBD");
    getStudentDetails(userAIDI);
    getStudentGradeById(userAIDI);
    getNumberOfPassedExamByIdOfStudent(userAIDI);
    venitDatoratDeStudent(userAIDI);
    procentajNote(userAIDI);
    loadExamListofUserById(userAIDI,idSpecializare, anStudiu);
}
function loadIndexOfTeacher() {
    var userAIDI = localStorage.getItem("idUtilizator");
    countTeacherExams(userAIDI);
    venitGenerat(userAIDI);
    checkWhatCourseHeTeach(userAIDI);
    loadProfile()
    failedStudentsOnCourse(userAIDI);
    preIncarcaSpecializariLaCareSePreda(userAIDI);

}
function loadMyPrograms() {
    var userAIDI = localStorage.getItem("idUtilizator");
    loadProfile();
    preIncarcaSpecializariLaCareSePreda(userAIDI);
}
   
function venitDatoratDeStudent(idUtilizator) {
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/calculeazaVenitPerStudent?idUtilizator=" + idUtilizator + "",
        async: false,
        success: function (response) {



            jQuery(".venitDatoratStudent").html(response);

        }
    });
}
function venitGenerat(userAIDI) {
    
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/calculeazaVenit?idUtilizator=" + userAIDI + "",
        async: false,
        success: function (response) {



            jQuery(".venitGenerat").html(response);

        }
    });
}
function checkWhatCourseHeTeach(userAIDI) {
    
    var usr = {
        'idUtilizator': userAIDI
    }
    var sum = 0;
    var a = 0

    jQuery.ajax({
        type: "GET",
        url: "https://localhost:44388/api/checkWhatCourseHeTeach?idUtilizator=" + userAIDI + "",
        data: JSON.stringify(usr),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            
            for (var i = 0; i < data.length; i++) {
                jQuery.ajax({
                    type: "POST",
                    url: "https://localhost:44388/api/adunaNumerele?idMaterie=" + data[i].idMaterie + "",
                    async: false,
                    success: function (response) {
                       
                        sum = sum + response;
                        
                        jQuery(".counterC").html(sum);
                        
                    }
                });
              
                jQuery.ajax({
                    type: "POST",
                    url: "https://localhost:44388/api/countPassedStudent?idMaterie=" + data[i].idMaterie + "",
                    async: false,
                    success: function (b) {

                        a = a + b;
                        jQuery(".counterPassedStudent").html(a);

                    }
                });
            }



            // Replace the div's content with the page method's return.

        },
        error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alert(msg);
        }

    });
}
function recoverPassword() {
    var email = document.getElementById('emailRec').value;
    
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/sendMail?email=" + email + "",
        async: false,
        success: function (response) {

            console.log("Mail trimis");
        },
        error: function (msg) {
            alert("Sorry!!! ");
        }
    });
}
function fillModalProfile() {
    jQuery(".firstName").text(localStorage.getItem('nume'));
    jQuery(".lastName").text(localStorage.getItem('prenume'));
    jQuery(".email").text(localStorage.getItem('email'));
    jQuery(".idRol").text(localStorage.getItem('id_rol'));
    jQuery(".adresa").text(localStorage.getItem('adresa'));
    jQuery(".numarTelefon").text(localStorage.getItem('numarTelefon'));


}
function fillModalEditUserData() {
    jQuery("#InputNumeProfilAdmin").val(localStorage.getItem('nume'));
    jQuery("#InputPrenumeProfiilAdmin").val(localStorage.getItem('prenume'));
    jQuery("#InputEmailProfilAdmin").val(localStorage.getItem('email'));
    jQuery("#InputParolaProfilAdmin").val(localStorage.getItem('parola'));
    jQuery("#InputAdresaProfilAdmin").val(localStorage.getItem('adresa')); 
    jQuery("#InputNumarProfilAdmin").val(localStorage.getItem('numarTelefon'));
   

}
function preLogOut() {
    const IdUtil = localStorage.getItem('idUtilizator');
    logOut(IdUtil);

}

function logOut(idUtil) {
    
    var usr = {
        'id_utilizator': idUtil // echivalentul 
    }

    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/userLogOut?idUtilizator=" + idUtil + "",
        data: JSON.stringify(usr),
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            window.location.href = "../../login.html";
            window.localStorage.clear();

            // Replace the div's content with the page method's return.

        },
        error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alert(msg);
        },

    });


}

function loadProfile() {
    const firstName = localStorage.getItem('nume');
    const lastName = localStorage.getItem('prenume');

    var result = firstName + " " + lastName;
    jQuery('.username').text(result);
    const rol = localStorage.getItem('denumireRol');
    jQuery('.grad').text(rol);
   

}



function mesajConectare(response) {
    if (response.statusConectare == "Conectare cu succes") {
        var conectareReusita = `<div class="alert alert-success alert-dismissible fade show">
        <strong>Success!</strong> Imediat o sa fii redirectionat pe pagina principala
        <button type="button" class="close" data-dismiss="alert">&times;</button>
    </div>`
    } else {
        var conectareReusita = `<div class="alert alert-danger" role="alert">
           Date de conectare incorecte!
</div>`
    }
    jQuery('.msgConectare').html(conectareReusita);

}

function getStudentDetails(userAIDI) {
    var usr = {
        'idUtilizator': userAIDI // echivalentul 
    }
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/getStudentDetails?idUtilizator=" + userAIDI + "",
        data: JSON.stringify(usr),
        contentType: "application/json",
        dataType: "json",
        success: function (a) {

            localStorage.setItem("anStudiuSetatCBD", a.anStudiu);
            localStorage.setItem("numeSpecializareSetat", a.numeSpecializare);
            localStorage.setItem("idSpecializareSetatC", a.idSpecializare);
            localStorage.setItem("nrCrediteSetat", a.nrCredite);
            localStorage.setItem("idSpecializareSetatDeStudent", a.idSpecializare);
            const anStudiu = localStorage.getItem('anStudiuSetatCBD');
            jQuery('.anStudiu').text(anStudiu);
            const numeSpec = localStorage.getItem('numeSpecializareSetat');
            jQuery('.nspecializare').text(numeSpec);
            const credite = localStorage.getItem('nrCrediteSetat');
            jQuery('.credite').text(credite);
            // Replace the div's content with the page method's return.

        },
        error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alert(msg);
        },

    });


}

// userProfile
function updateData() {
    var userAIDI = window.localStorage.getItem('idUtilizator');
    var usr = {
        'idUtilizator': userAIDI, // echivalentul 
        'nume': document.getElementById('InputNumeProfilAdmin').value,
        'prenume': document.getElementById('InputPrenumeProfiilAdmin').value,
        'adresa': document.getElementById('InputAdresaProfilAdmin').value,
        'email': document.getElementById('InputEmailProfilAdmin').value,
        'parola': document.getElementById('InputParolaProfilAdmin').value,
        'numarTelefon': document.getElementById('InputNumarProfilAdmin').value,
    }
    
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/updateData",
        data: JSON.stringify(usr),
        contentType: "application/json",

        success: function (data) {
            console.log("Update successfully");
            var a = data;
            var usr = {
                'idUtilizator': userAIDI // echivalentul 
            }

            jQuery.ajax({
                type: "POST",
                url: "https://localhost:44388/api/getAllUserInformation?idUtilizator=" + userAIDI + "",
                data: JSON.stringify(usr),
                contentType: "application/json",
                dataType: "json",
                success: function (a) {

                    window.localStorage.setItem('nume', a.nume);
                    window.localStorage.setItem('prenume', a.prenume);

                    window.localStorage.setItem('idUtilizator', a.idUtilizator);


                    window.localStorage.setItem('email', a.email);

                    window.localStorage.setItem('id_rol', a.idRol);
                    window.localStorage.setItem('adresa', a.adresa);
                    window.localStorage.setItem('numarTelefon', a.numarTelefon);
                    window.localStorage.setItem('adresa', a.adresa);
                    window.localStorage.setItem('parola', a.parola);
                    window.localStorage.setItem('numeMaterie', a.numeMaterie);
                    window.localStorage.setItem('denumireRol', a.denumireRol);
                   

                    const firstName = localStorage.getItem('nume');
                    jQuery('.firstName').text(firstName);
                    const lastName = localStorage.getItem('prenume');
                    jQuery('.lastName').text(lastName);

                    const grad = localStorage.getItem('denumireRol');
                    jQuery('.grad').text(grad);
                    const email = localStorage.getItem('email');
                    jQuery('.email').text(email)
                    const nrTel = localStorage.getItem('numarTelefon');
                    jQuery('.numarTelefon').text(nrTel)
                    const adresa = localStorage.getItem('adresa');
                    jQuery('.adresa').text(adresa)
                    location.reload();

                    // Replace the div's content with the page method's return.

                },
                error: function (jqXHR, exception) {
                    var msg = '';
                    if (jqXHR.status === 0) {
                        msg = 'Not connect.\n Verify Network.';
                    } else if (jqXHR.status == 404) {
                        msg = 'Requested page not found. [404]';
                    } else if (jqXHR.status == 500) {
                        msg = 'Internal Server Error [500].';
                    } else if (exception === 'parsererror') {
                        msg = 'Requested JSON parse failed.';
                    } else if (exception === 'timeout') {
                        msg = 'Time out error.';
                    } else if (exception === 'abort') {
                        msg = 'Ajax request aborted.';
                    } else {
                        msg = 'Uncaught Error.\n' + jqXHR.responseText;
                    }
                    alert(msg);
                },

            });


        },
        failure: function (msg) {
            alert("Sorry!!! ");

        }
    });

}
function updateDataAdmin(idUtilizator) {
   
    var usr = {
        'idUtilizator': idUtilizator,
        'nume': document.getElementById('InputNumeAdmin').value,
        'prenume': document.getElementById("InputPrenumeAdmin").value,
        'adresa': document.getElementById("InputAdresaAdmin").value,
        'email': document.getElementById("InputEmailAdmin").value,
        'parola': document.getElementById("InputParolaAdmin").value,
        'numarTelefon': document.getElementById("InputNumarAdmin").value,
        'statut': document.getElementById("InputStatutAdmin").value,
        

    }
  
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/updateAccountAdmin",
        data: JSON.stringify(usr),
        contentType: "application/json",

        success: function (data) {
            console.log("Update successfully");
        },
        failure: function (msg) {
            alert("Sorry!!! ");
        }
    });

}
function updateContorPicati(idMaterie) {

    var usr = {
        'idMaterie': idMaterie,
        


    }
    
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/updateContorCazuti",
        data: JSON.stringify(usr),
        contentType: "application/json",

        success: function (data) {
            console.log("Update successfully");
        },
        failure: function (msg) {
            alert("Sorry!!! ");
        }
    });

}
function updateContorTrecuti(idMaterie) {

    var usr = {
        'idMaterie': idMaterie,



    }
    
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/updateContorTrecuti",
        data: JSON.stringify(usr),
        contentType: "application/json",

        success: function (data) {
            console.log("Update successfully");
        },
        failure: function (msg) {
            alert("Sorry!!! ");
        }
    });

}
function creeazaSpecializare() {


    var usr = {

        'numeSpecializare': document.getElementById('inputNumeSpecializare').value,
        'locuriDisponibile': document.getElementById("inputNumarMaximSpecializare").value,
        'locuriOcupate': document.getElementById("inputLocuriOcupateSpecializare").value,
        'aniStudiu': document.getElementById("inputAniStudiu").value

    }
   
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/creeazaSpecializare",
        data: JSON.stringify(usr),
        contentType: "application/json",

        success: function (data) {
            console.log("Specializare creeata cu succes");
        },
        failure: function (msg) {
            alert("Sorry!!! ");
        }
    });

}
function editeazaSpecializare(idSpecializare) {

    var usr = {
        'idSpecializare': idSpecializare,
        'numeSpecializare': document.getElementById('inputNumeSpecializare').value,
        'locuriDisponibile': document.getElementById('inputLocuriDisponibile').value,
        'locuriOcupate': document.getElementById('inputLocuriOcupate').value,
        'aniStudiu': document.getElementById('inputAniStudiu').value

    }
    
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/editeazaSpecializare",
        data: JSON.stringify(usr),
        contentType: "application/json",

        success: function (data) {
            console.log("Update successfully");
        },
        failure: function (msg) {
            alert("Sorry!!! ");
        }
    });


}
//
//index pages//
function getNumberOfAccounts() {
    
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/getNumberOfAccounts",
        async: false,
        success: function (response) {
            
            jQuery(".studentCounter").html(response);
        }
    });
       

};
function getNumberOfStudentsEnrolled(idMaterie) {
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/adunaNumerele?idMaterie="+idMaterie+"",
        async: false,
        success: function (response) {

            console.log(response);
        }
    });
}
function getNumberOfTeachers() {

    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/getNumbersOfTeacher",
        async: false,
        success: function (response) {
           
            jQuery(".teacherCounter").html(response);
        }
    });


};
function getNumberOfPrograms() {
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/getNumberOfPrograms",
        async: false,
        success: function (response) {
            console.log(response);
            jQuery(".programsCounter").html(response);
        }
    });
};
// tabele //
function loadItems() {
    jQuery.noConflict();
    jQuery.ajax({
        url: "https://localhost:44388/api/getAllAnnouncement",
        type: "get",
        dataType: "json",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: mySuccHandler

    });
}
var addBtn = '<a href="#" class="btn btn-sm bg-teal"><i class="fas fa-pen"></i></a>'
var deleteBtn = `<a href="#" class="btn btn-sm bg-teal"><i class="fas fa-trash"></i></a>`

function mySuccHandler(data) {
    jQuery.noConflict();
    try {

        jQuery('#anunturi').DataTable({
            "aaData": data,
            "aoColumns": [

                {
                    "mData": "userId"
                },

                {
                    "mData": "nume"
                },
                {
                    "mData": "prenume"
                },
                {
                    "mData": "mesaj"
                },
                {
                    "mData": "data"
                },
                {

                    className: "center",
                    defaultContent: addBtn + "    " + deleteBtn

                }


            ]

        });

    } catch (e) {
        alert(e.message);
    }

}
// management membrii specializari 
function preIncarcaMembriiSpecializari(idSpecializare) {

    jQuery.noConflict();
    jQuery.ajax({
        url: "https://localhost:44388/api/getProfilesMembers?idSpecializare=" + idSpecializare + "",
        type: "post",
        dataType: "json",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: incarcaMembriiSpecializari



    });
}


function Edit(Id) {
    alert(Id);
}

function incarcaMembriiSpecializari(data) {
    jQuery.noConflict();

    try {

        jQuery('#tblMembriiSpecializari').DataTable({
            "bProcessing": true,

            paging: false,
            searching: false,
            destroy: true,
            "aaData": data,
            "aoColumns": [

                {
                    "mData": "idUtilizator"
                },

                {
                    "mData": "nume"
                },
                {
                    "mData": "prenume"
                },
                {
                    "mData": "numeSpecializare"
                },
                {
                    "mData": "anStudiu"
                },
                {
                    "mData": "nrCredite"
                },
                {


                    mRender: function (data, type, row) {


                        return '<a class="btn btn-success btn-sm" href="#"> <i class="fas fa-plus" >  </i > </a>'
                    }


                }


                // Handle click on "View" button
            ]




        });

    } catch (e) {
        alert(e.message);
    }

}
// management specializari
function incarcaSpec() {
    jQuery.noConflict();
    jQuery.ajax({
        url: "https://localhost:44388/api/incarcaSpecializare",
        type: "get",
        dataType: "json",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: incarcaSpecializari

    });
}

function incarcaSpecializarilePentruPromovare() {
    jQuery.noConflict();
    jQuery.ajax({
        url: "https://localhost:44388/api/incarcaSpecializare",
        type: "get",
        dataType: "json",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: incarcaSpecializarilePentruPromovareT

    });
}
function incarcaSpecializarilePentruPromovareT(data) {
    jQuery.noConflict();

    try {

        jQuery('#tblSpc1').DataTable({
            "aaData": data,
            "aoColumns": [

                {
                    "mData": "idSpecializare"
                },

                {
                    "mData": "numeSpecializare"
                },
               
                {
                    "mData": "aniStudiu"
                },
                {

                    mRender: function (data, type, row) {


                        //  return '<a class="btn btn-danger btn-sm" href="#"> <i class="fas fa-trash" id="stergeSpecializare" onClick=" stergeSpecializare(' + row.idSpecializare + ')" >  </i > </a><a class="btn btn-info btn-sm" href="#" ><i type="button" data-toggle="modal" data-target="#modal-default" class="fas fa-info id="btnModificaSpecializare" onClick="detaliiSpecializare(' + row.idSpecializare + ')"></i></a><a class="btn btn-search btn-sm" href="#" ><i type="button" data-toggle="modal" data-target="#modal-vizualizareListaMembrii" class="fas fa-search id="btnTeRogMeri" onClick="preIncarcaMembriiSpecializari(' + row.idSpecializare + ')"></i></a>'
                        return `<div class="dropdown">
                                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                    <span class="flaticon-more-button-of-three-dots"></span>
                                                </a>
                                                <div class="dropdown-menu dropdown-menu-right">

                                                    <a class="dropdown-item" href="#" id="modificaAnStudiu"  data-toggle="modal" data-target="#modal-pt-avansare" onClick="idspec(` + row.idSpecializare + `)"><i class="fas fa-cogs text-dark-pastel-green"></i>UP</a>
                                                     
                                                   
                                                </div>
                                            </div>`

                      
                    }


                }


                // Handle click on "View" button
            ]




        });

    } catch (e) {
        alert(e.message);
    }

}
function incarcaSpecializari(data) {
    jQuery.noConflict();

    try {

        jQuery('#tblSpecializari').DataTable({
            "aaData": data,
            "aoColumns": [

                {
                    "mData": "idSpecializare"
                },

                {
                    "mData": "numeSpecializare"
                },
                {
                    "mData": "locuriDisponibile"
                },
                {
                    "mData": "locuriOcupate"
                },
                {
                    "mData": "aniStudiu"
                },
                {

                    mRender: function (data, type, row) {


                      //  return '<a class="btn btn-danger btn-sm" href="#"> <i class="fas fa-trash" id="stergeSpecializare" onClick=" stergeSpecializare(' + row.idSpecializare + ')" >  </i > </a><a class="btn btn-info btn-sm" href="#" ><i type="button" data-toggle="modal" data-target="#modal-default" class="fas fa-info id="btnModificaSpecializare" onClick="detaliiSpecializare(' + row.idSpecializare + ')"></i></a><a class="btn btn-search btn-sm" href="#" ><i type="button" data-toggle="modal" data-target="#modal-vizualizareListaMembrii" class="fas fa-search id="btnTeRogMeri" onClick="preIncarcaMembriiSpecializari(' + row.idSpecializare + ')"></i></a>'
                        return `<div class="dropdown">
                                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                    <span class="flaticon-more-button-of-three-dots"></span>
                                                </a>
                                                <div class="dropdown-menu dropdown-menu-right">
                                                    <a class="dropdown-item" href="#" id="stergeSpecializare" onClick="stergeSpecializare(`+ row.idSpecializare + `)"><i class="fas fa-times text-orange-red"></i>Delete</a>
                                                    <a class="dropdown-item" href="#" id="modificaSpecializare" onClick="detaliiSpecializare(`+ row.idSpecializare + `)" data-toggle="modal" data-target="#modal-AdminEditSpec"><i class="fas fa-cogs text-dark-pastel-green"></i>Edit</a>
                                                    
                                                   
                                                </div>
                                            </div>`

                        var acb = localStorage.setItem("abc", row.idSpecializare)
                    }


                }


                // Handle click on "View" button
            ]




        });

    } catch (e) {
        alert(e.message);
    }

}
function detaliiCont(idUtilizator) {
    

    jQuery.ajax({
        url: 'https://localhost:44388/api/detaliiCont?idUtilizator=' + idUtilizator + '',

        type: 'GET',
        async: true,
        cache: false,
        success: function (result) {

            var idUtilizator1 = result.idUtilizator;
            localStorage.setItem('idUtilizatorr', idUtilizator1);
            jQuery("#InputNumeAdmin").val(result.nume);
            jQuery("#InputPrenumeAdmin").val(result.prenume);
            jQuery("#InputEmailAdmin").val(result.email);
            jQuery("#InputParolaAdmin").val(result.parola);
            jQuery("#InputAdresaAdmin").val(result.adresa);
            jQuery("#InputNumarAdmin").val(result.numarTelefon);

            jQuery("#InputStatutAdmin").val(result.statut);


           
        }

    });

}


function stergeSpecializare(idSpecializare) {
    var usr = {

        'idSpecializare': idSpecializare,


    }
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/stergeSpecializare",
        data: JSON.stringify(usr),
        contentType: "application/json",

        success: function (data) {
            console.log("Specializare stearsa cu succes");
        },
        failure: function (msg) {
            alert("Sorry!!! ");
        }
    });

}
function detaliiSpecializare(idSpecializare) {


    jQuery.ajax({
        url: 'https://localhost:44388/api/detaliiSpecializare?idSpecializare=' + idSpecializare + '',

        type: 'GET',
        async: true,
        cache: false,
        success: function (result) {
            var y = result.idSpecializare;
            localStorage.setItem('idSpecializaree', y);
            jQuery("#inputNumeSpecializare").val(result.numeSpecializare);
            jQuery("#inputLocuriDisponibile").val(result.locuriDisponibile);
            jQuery("#inputLocuriOcupate").val(result.locuriOcupate);
            jQuery("#inputAniStudiu").val(result.aniStudiu);




        }

    });
    
}
// management conturi 
//
function createANewUser() {
    if (document.getElementById("inputStatut").value > 0) {
        
        var usr = {

            'nume': document.getElementById('inputFirstName').value,
            'prenume': document.getElementById("inputLastName").value,
            'email': document.getElementById("inputEmail").value,
            'parola': document.getElementById("inputPassword").value,
            'adresa': document.getElementById("inputAdresa").value,
            'numarTelefon': document.getElementById("inputPhoneNumber").value,
            'idRol': document.getElementById("inputStatut").value,
            'conectat': 'false',
            'idSpecializare': document.getElementById("inputSpecializare").value

        }
        
        jQuery.ajax({
            type: "POST",
            url: "https://localhost:44388/api/creeazaUser",
            data: JSON.stringify(usr),
            contentType: "application/json",

            success: function (data) {
                console.log("Specializare creeata cu succes");
            },
            failure: function (msg) {
                alert("Sorry!!! ");
            }
        });
    } else {
        alert("Please choose a statut");
    }
}
function promoveazaAnul(nr_credite_necesare) {
    var usr = {
        'anStudiu': document.getElementById('inputAnCurent').value,
        'idSpecializare': localStorage.getItem("idSpc1"),
        'nr_credite_necesare': nr_credite_necesare
    }

    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/modificaAnul",
        data: JSON.stringify(usr),
        contentType: "application/json",

        success: function (data) {
            console.log("An modificat cu succes");
        },
        failure: function (msg) {
            alert("Sorry!!! ");
        }
    });
    
}

function failedStudentsOnCourse(idUtilizator) {

    var options = {
        title: 'Statistica studenti cazuti la cursurile proprii ',
        pieHole: 0.4,                       // SET NUMBER BETWEEN 0 AND 1.
        colors: ['red', '#56B21F']
        // ADD CUSTOM COLORS.
    };
 
    jQuery.ajax({
        url: "https://localhost:44388/api/checkCeva?idUtilizator=" + idUtilizator + "",
        dataType: "json",
        type: "POST",
        success: function (data) {

            var arrValues = [['Materie', 'numar']];        // DEFINE AN ARRAY.
            var iCnt = 0;

            jQuery.map(data, function () {
                var test = data[iCnt].idMaterie + "." +data[iCnt].numeMaterie
                console.log(test);
                arrValues.push([test, data[iCnt].numar]);
                iCnt += 1;
            });

            // CREATE A DataTable AND ADD THE ARRAY (WITH DATA) IN IT
            var figures = google.visualization.arrayToDataTable(arrValues)

            // THE TYPE OF CHART. IT’S A PIE CHART, HOWEVER THE “pieHole” OPTION
            // (SEE “var options” ABOVE) WILL ADD A SPACE AT THE CENTER FOR DONUT.
            var chart = new google.visualization.PieChart(document.getElementById('b_sale'));

            chart.draw(figures, options);      // DRAW GRAPH WITH THE DATA AND OPTIONS.
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert('There was an Error');
        }
    });
}
function studentsLoad() {
    var idMaterie = localStorage.getItem("idMaterieSetat");
    passedAndFailedChartBind(idMaterie);
}
function passedAndFailedChartBind(idMaterie) {

    var options = {
        title: 'Statistica note materie',
        pieHole: 0.3,                       // SET NUMBER BETWEEN 0 AND 1.
        colors: ['red', '#56B21F']
        // ADD CUSTOM COLORS.
    };

    jQuery.ajax({
        url: "https://localhost:44388/api/passOrFailStudent?idMaterie=" + idMaterie + "",
        dataType: "json",
        type: "POST",
        success: function (data) {

            var arrValues = [[ 'numar','nrPicati']];        // DEFINE AN ARRAY.
            var iCnt = 0;

            jQuery.map(data, function () {
               
                var test = data[iCnt].idMaterie + "." + data[iCnt].numeMaterie
                console.log(test);
                
             
                arrValues.push(['Procentaj  studenti cazuti la aceasta materie', data[iCnt].numar]);
                arrValues.push(['Procentaj studenti trecuti la aceasta materie', data[iCnt].nrTrecuti]);
                iCnt += 1;
            });

            // CREATE A DataTable AND ADD THE ARRAY (WITH DATA) IN IT
            var figures = google.visualization.arrayToDataTable(arrValues)

            // THE TYPE OF CHART. IT’S A PIE CHART, HOWEVER THE “pieHole” OPTION
            // (SEE “var options” ABOVE) WILL ADD A SPACE AT THE CENTER FOR DONUT.
            var chart = new google.visualization.PieChart(document.getElementById('ddd'));

            chart.draw(figures, options);
            // DRAW GRAPH WITH THE DATA AND OPTIONS.
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert('There was an Error');
        }
    });
}

function p(x) {
    var xxa = localStorage.setItem("idMatContor", x);
}
function idspec(idSpecializare) {

    var idSpc1 = localStorage.setItem("idSpc1", idSpecializare);
    var getIdSpc1 = localStorage.getItem("idSpc1");
    
}
function insertAGrade() {

    var k = localStorage.getItem('anStudiuSetat');
    var usr = {

        'idUtilizator': document.getElementById('inputUserID').value,
        'idMaterie': document.getElementById("inputMaterie").value,
        'nota': document.getElementById("inputNota").value,
        'anStudiu': k

    };
    
        jQuery.ajax({
            type: "POST",
            url: "https://localhost:44388/api/insertAGrade",
            data: JSON.stringify(usr),
            contentType: "application/json", 

            success: function (data) {
                console.log("Student notat cu success");
                var zac = document.getElementById("inputMaterie").value;
                var px = document.getElementById("inputNota").value
                if (px < 5) {
                    updateContorPicati(zac);
                } else {
                    updateContorTrecuti(zac);
                }
            },
            failure: function (msg) {
                alert("Sorry!!! ");
            }
        });
   
}
function getNumberOfPassedExamByIdOfStudent(userAIDI) {

    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/getNumberOfPassedExamByIdOfStudent?idUtilizator=" + userAIDI + "",
        async: false,
        success: function (response) {



            jQuery(".examenePromovate").html(response);

        }
    });
}
function createExam() {

    var k = localStorage.getItem('idUtilizator');
    var ok = localStorage.getItem('idEx');
    var usr = {

        'idSpecializare': ok,
        'idMaterie': document.getElementById("inputMaterieDropDownExamen").value,
        'data': document.getElementById("dataExamen").value,
        'idUtilizator': k,
        'oraExamen': document.getElementById("inputOraExamen").value,
        'timp': document.getElementById("inputSolvingTime").value,
        'anStudiu': document.getElementById("inputanStudiu").value
    };
    
   
    
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/createExam",
        
        data: JSON.stringify(usr),
        contentType: "application/json",

        success: function (data) {
            
            console.log("Examen creat cu success");
        },
        failure: function (msg) {
            alert("Sorry!!! ");
        }
    });

}
function getAllRoles() {
    jQuery.ajax({
        type: "GET",
        url: "https://localhost:44388/api/getAllRoles",
        data: "{}",
        success: function (data) {
            var s = '<option value="-1">Please Select a role</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].idRol + '">' + data[i].denumire + '</option>';
              
            }

            jQuery("#inputStatut").html(s);
        }
    });

}
function getAllCourseWhereTeacherTeach(idUtilizator) {
    jQuery.ajax({
        type: "GET",
        url: "https://localhost:44388/api/getAllCourseWhatHeTeach?idUtilizator=" + idUtilizator+"",
        data: "{}",
        success: function (data) {
            var s = '<option value="-1">Please Select a course</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].idMaterie + '" > ' + data[i].numeMaterie + '</option > ';
                jQuery('#inputMaterieDropDownExamen').on('change', function () {
                    var value = jQuery(this).val();
                    getProgramName(value);
                });
                
            }

            jQuery("#inputMaterieDropDownExamen").html(s);
           
        }
    });
   
}
function putInLocalStorageThisData(idMaterie) {
    localStorage.setItem("idMaterieSetatLaDropDown", idMaterie);
}
function getProgramName(idMaterie) {
 
    jQuery.ajax({
        type: "GET",
        url: "https://localhost:44388/api/getProgramID?idMaterie=" + idMaterie + "",
        data: "{}",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                s = data[i].idSpecializare;
                console.log(s)
                localStorage.setItem("idEx", s)
                
            }
            jQuery("#inputSpecializareAddExam").val(s);
        }
    });
}
function aduSpecializarilePtRegister() {
    jQuery.ajax({
        type: "GET",
        url: "https://localhost:44388/api/incarcaSpecializare",
        data: "{}",
        success: function (data) {
            var s = '<option value="-1">Please Select a role</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].idSpecializare + '">' + data[i].numeSpecializare + '</option>';

            }

            jQuery("#inputSpecializare").html(s);
        }
    });

}
function incarcaConturiA() {
  
    jQuery.ajax({
        url: "https://localhost:44388/api/incarcaConturi",
        type: "get",
        dataType: "json",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: incarcaConturi

    });

}





function incarcaConturi(data) {

    jQuery.noConflict();

    try {

        jQuery('#incarcaConturi').DataTable({
            "aaData": data,
            "aoColumns": [


                {
                    "mData": "idUtilizator"
                },

                {
                    "mData": "nume"
                },
                {
                    "mData": "prenume"
                },
                {
                    "mData": "email"
                },
                {
                    "mData": "parola"
                },
                {
                    "mData": "adresa"
                },
                {
                    "mData": "numarTelefon"
                },
                {
                    "mData": "conectat"
                },
                {
                    "mData": "statut"
                },

                {

                    mRender: function (data, type, row) {

                        return `<div class="dropdown">
                                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                    <span class="flaticon-more-button-of-three-dots"></span>
                                                </a>
                                                <div class="dropdown-menu dropdown-menu-right">
                                                    <a class="dropdown-item" href="#" id="stergeCont" onClick="stergeCont(`+row.idUtilizator+`)"><i class="fas fa-times text-orange-red"></i>Delete</a>
                                                    <a class="dropdown-item" href="#" id="modificaCont" onClick="detaliiCont(`+ row.idUtilizator +`)" data-toggle="modal" data-target="#modal-AdminEditUserProfile"><i class="fas fa-cogs text-dark-pastel-green"></i>Edit</a>
                                                   
                                                </div>
                                            </div>`

                    }


                }


                // Handle click on "View" button
            ]




        });

    } catch (e) {
        alert(e.message);
    }

}
function stergeCont(idUtilizator) {
    var usr = {

        'idUtilizator': idUtilizator,


    }
    
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/stergeCont",
        data: JSON.stringify(usr),
        contentType: "application/json",
        success: function (data) {
            console.log("Cont sters cu succes");
        },
        failure: function (msg) {
            alert("Sorry!!! ");
        }
    });

}
function stergeExamen(exam_id) {
    var usr = {

        'exam_id': exam_id,


    }
   
    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/stergeExam",
        data: JSON.stringify(usr),
        contentType: "application/json",
        success: function (data) {
            console.log("Examen sters cu succes");
        },
        failure: function (msg) {
            alert("Sorry!!! ");
        }
    });

}
// management cadre didactice

function loadAllTeachers() {

    jQuery.noConflict();
    jQuery.ajax({
        url: "https://localhost:44388/api/loadAllTeachers",
        type: "get",
        dataType: "json",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: loadAllTeachersT

    });
}

function loadAllTeachersT(data) {
    jQuery.noConflict();

    try {

        jQuery('#tblProfesori').DataTable({
            "aaData": data,
            "aoColumns": [
                {
                    "mData": "id"
                },

                {
                    "mData": "idUtilizator"
                },

                {
                    "mData": "nume"
                },
                {
                    "mData": "prenume"
                },
                {
                    "mData": "numeMaterie"
                },
                {
                    "mData": "numeSpecializare"
                },

                {

                    mRender: function (data, type, row) {


                      //  return '<a class="btn btn-danger btn-sm" href="#"> <i class="fas fa-trash" id="stergeProfesor" onClick=" deleteTeacher(' + row.id + ')" >  </i > </a><a class="btn btn-danger btn-sm" href="#"> <i data-toggle="modal" data-target="#modal-default" class="fas fa-pencil-alt" id="editTeacher" onClick=" teacherDetails(' + row.id + ')" >  </i > </a>'
                        return `<div class="dropdown">
                                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                    <span class="flaticon-more-button-of-three-dots"></span>
                                                </a>
                                                <div class="dropdown-menu dropdown-menu-right">
                                                    <a class="dropdown-item" href="#" id="deleteTeacher" onClick="deleteTeacher(`+ row.id + `)"><i class="fas fa-times text-orange-red"></i>Delete</a>
                                                    <a class="dropdown-item" href="#" id="editTeacher" onClick="teacherDetails(`+ row.id + `)" data-toggle="modal" data-target="#modal-AdminSetTeacherCourseById"><i class="fas fa-cogs text-dark-pastel-green"></i>Edit</a>
                                                   
                                                </div>
                                            </div>`
                    }


                }



            ]




        });

    } catch (e) {
        alert(e.message);
    }

}

function deleteTeacher(id) {
    var usr = {

        'id': id,


    }

    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/deleteTeacher",
        data: JSON.stringify(usr),
        contentType: "application/json",

        success: function (data) {
            console.log("Profesor sters cu succes");
        },
        failure: function (msg) {
            alert("Sorry!!! ");
        }
    });

}
function getAllCourses() {
    jQuery.ajax({
        type: "GET",
        url: "https://localhost:44388/api/getAllCourses",
        data: "{}",
        success: function (data) {
            var s = '<option value="-1">Please Select Course</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].idMaterie + '">' + data[i].numeMaterie + '</option>';
            }
            jQuery("#inputMaterie").html(s);
        }
    });

}
function teacherDetails(id) {


    jQuery.ajax({
        url: 'https://localhost:44388/api/teacherDetails?id=' + id + '',

        type: 'GET',
        async: true,
        cache: false,
        success: function (result) {

            var teacherID = result.id;
            localStorage.setItem('teacherId', teacherID);
            jQuery("#InputNumeAdmin").val(result.nume);
            jQuery("#InputPrenumeAdmin").val(result.prenume);
            jQuery("#inputinputMaterie").val(result.numeMaterie);



        }

    });

}
function setTeacherCourseById(teacherID) {

    var usr = {
        'id': teacherID,
        'idMaterie': document.getElementById("inputMaterie").value,


    }

    jQuery.ajax({
        type: "POST",
        url: "https://localhost:44388/api/setTeacherCourse",
        data: JSON.stringify(usr),
        contentType: "application/json",

        success: function (data) {
            console.log("Update successfully");
        },
        failure: function (msg) {
            alert("Sorry!!! ");
        }
    });

}
// teacher zone
function preIncarcaSpecializariLaCareSePreda(userAIDI) {
   
    jQuery.noConflict();
    jQuery.ajax({
        url: "https://localhost:44388/api/checkWhatCourseHeTeach?idUtilizator=" + userAIDI + "",
        type: "get",
        dataType: "json",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: incarcaSpc

    });
}
function testamceva(idMaterie, idSpecializare) {

    localStorage.setItem("idMaterieSetat", idMaterie);
    localStorage.setItem("idSpecializareSetat", idSpecializare);
    windows.reload();
   
 
    
}
function incarcaSpc(data) {
    jQuery.noConflict();

    try {

        jQuery('#incarcaSpecializariLaCarePreda').DataTable({
            "aaData": data,
            "aoColumns": [



                {
                    "mData": "idMaterie"
                },
                {
                    "mData": "numeMaterie"
                },
                {
                    "mData": "numeSpecializare"
                },
                {
                    "mData": "numarCredite"
                },
                {
                    "mData": "anStudiu"
                },
                {


                    mRender: function (data, type, row) {


                         return '<a class="btn btn-info btn-sm" href="students.html" ><i type="button"  class="fa fa-search" id="btnIncarcaStudentiInscrisi" onClick="testamceva(' + row.idMaterie + ',' + row.idSpecializare +')"  ></i ></a > '
                      //  return `<div class="dropdown">
                     //                           <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                         //                           <span class="flaticon-more-button-of-three-dots"></span>
                        //                        </a>
                          //                      <div class="dropdown-menu dropdown-menu-right">
                            //                        <a class="dropdown-item" href="students.html" ><i class="fas fa-times text-orange-red" id="btnIncarcaStudentiInscrisi" onClick="testamceva(' + row.idMaterie + ',' + row.idSpecializare +')"></i>View</a>
                                                  
                                                    
                                                   
                                   //             </div>
                                //            </div>`
                    }


                }


                // Handle click on "View" button
            ]




        });

    } catch (e) {
        alert(e.message);
    }


}

function studentiInscrisi(idSpecializare, idMaterie) {

    jQuery.noConflict();
    jQuery.ajax({
        url: "https://localhost:44388/api/loadAllStudentsEnroledAtCourseByIdOfCourseAndIdOfType?idSpecializare=" + idSpecializare + "&idMaterie=" + idMaterie + "",
        type: "get",
        dataType: "json",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: incarcaStudentiDupamaterieSiSpec

    });

}
function setInLocalStorageData(idUtilizator, anStudiu) {
    localStorage.setItem("idUtilizatorSetat", idUtilizator);
    localStorage.setItem("anStudiuSetat", anStudiu);
    fillModalSetGrade();
    
   
}

function incarcaStudentiDupamaterieSiSpec(data) {
    jQuery.noConflict();

    try {

        jQuery('#tblStudenti').DataTable({
            "aaData": data,
            "autoWidth": true,
            "aoColumns": [


                {
                    "mData": "idUtilizator"
                },
                {
                    "mData": "nume"
                },
                {
                    "mData": "prenume"
                },
                {
                    "mData": "anStudiu"
                },
                {


                    mRender: function (data, type, row) {


                        return '<a class="btn btn-info btn-sm" data-toggle="modal" data-target="#add-grade-modal" id="btnEvaluazaStudent" onClick="setInLocalStorageData(' + row.idUtilizator + ',' + row.anStudiu + ')"> Noteaza</a > '
                    }


                }


                // Handle click on "View" button
            ]




        });

    } catch (e) {
        alert(e.message);
    }


}
function countExamByIdOfUser(idUtilizator, idSpecializare, anStudiu) {

    jQuery.noConflict();
    jQuery.ajax({
        url: "https://localhost:44388/api/getExamListUserById?idUtilizator=" + idUtilizator + "&idSpecializare=" + idSpecializare + "&anStudiu=" + anStudiu + "",
        type: "get",
        dataType: "json",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: function (data) {
            var count = Object.keys(data).length;
            
            jQuery(".totalExamene").html(count);
        }

    });
}
function loadExamListofUserById(idUtilizator,idSpecializare,anStudiu) {

    jQuery.noConflict();
    jQuery.ajax({
        url: "https://localhost:44388/api/getExamListUserById?idUtilizator="+idUtilizator+"&idSpecializare=" + idSpecializare + "&anStudiu="+anStudiu+"",
        type: "get",
        dataType: "json",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: loadExamListofUserByIdT

    });
}

function loadExamListofUserByIdT(data) {
    jQuery.noConflict();

    try {

        jQuery('#test').DataTable({
            "aaData": data,
            "aoColumns": [
                {
                    "mData": "exam_id"
                },

                {
                    "mData": "numeMaterie"
                },

                {
                    "mData": "numeSpecializare"
                },
                {
                    "mData": "data"
                },
                {
                    "mData": "oraExamen"
                },
                {
                    "mData": "timp"
                },
               
                



            ]




        });

    } catch (e) {
        alert(e.message);
    }

}
function loadExamListById(idUtilizator) {

    jQuery.noConflict();
    jQuery.ajax({
        url: "https://localhost:44388/api/getExamList?idUtilizator="+idUtilizator+"",
        type: "get",
        dataType: "json",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: loadExamListByIdT

    });
}

function loadExamListByIdT(data) {
    jQuery.noConflict();

    try {

        jQuery('#listaExameneById').DataTable({
            "aaData": data,
            "aoColumns": [
                {
                    "mData": "exam_id"
                },

                {
                    "mData": "numeMaterie"
                },

                {
                    "mData": "numeSpecializare"
                },
                {
                    "mData": "data"
                },
                {
                    "mData": "oraExamen"
                },
                {
                    "mData": "timp"
                },
                {
                    "mData": "anStudiu"
                },
                {

                    mRender: function (data, type, row) {


                        //  return '<a class="btn btn-danger btn-sm" href="#"> <i class="fas fa-trash" id="stergeProfesor" onClick=" deleteTeacher(' + row.id + ')" >  </i > </a><a class="btn btn-danger btn-sm" href="#"> <i data-toggle="modal" data-target="#modal-default" class="fas fa-pencil-alt" id="editTeacher" onClick=" teacherDetails(' + row.id + ')" >  </i > </a>'
                        return `<div class="dropdown">
                                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                    <span class="flaticon-more-button-of-three-dots"></span>
                                                </a>
                                                <div class="dropdown-menu dropdown-menu-right">
                                                    <a class="dropdown-item" href="#" id="stergeSpecializare" onClick="stergeExamen(`+ row.exam_id + `)"><i class="fas fa-times text-orange-red"></i>Delete</a>
                                                    <a class="dropdown-item" href="#" id="modificaSpecializare" onClick="detaliiExamen(`+ row.idSpecializare + `)" data-toggle="modal" data-target="#modal-AdminEditSpec"><i class="fas fa-cogs text-dark-pastel-green"></i>Edit</a>
                                                    
                                                   
                                                </div>
                                            </div>`
                    }


                }



            ]




        });

    } catch (e) {
        alert(e.message);
    }

}
function fillModalSetGrade() {
    jQuery("#inputUserID").val(localStorage.getItem('idUtilizatorSetat'));
    jQuery("#inputMaterie").val(localStorage.getItem('idMaterieSetat'));
    
}
function procentajNote(idUtilizator) {
    
    jQuery.noConflict();
    var contorel = 0;
    jQuery.ajax({
        url: "https://localhost:44388/api/procentajNote?idUtilizator=" + idUtilizator + "",
        type: "get",
        dataType: "json",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: function (response) {
            var count = Object.keys(response).length;
            console.log(count);
            


                for (i = 0; i < response.length; i++) {

                    console.log(response[i].nota);
                    if (response[i].nota >= 5) {
                        contorel++;
                    }
            }
            var procentaj = contorel / count * 100;
            valoare = (procentaj).toFixed(2);
         
                            
                    
            //}
            
          //  console.log(test);
            jQuery(".promovabilitate").html(valoare); 
        }

    });
}
function getListOfStudentClassById(idSpecializare,anStudiu) {
    
    jQuery.noConflict();
    jQuery.ajax({
        url: "https://localhost:44388/api/getClassMates?idSpecializare=" + idSpecializare + "&anStudiu="+anStudiu+"",
        type: "get",
        dataType: "json",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: getListOfStudentClassByIdT

    });
}
function getListOfStudentClassByIdT(data) {
    jQuery.noConflict();

    try {

        jQuery('#tabelColegi').DataTable({
            "aaData": data,
            "aoColumns": [



               
                {
                    "mData": "nume"
                },
                {
                    "mData": "prenume"
                },
                {
                    mRender: function (data, type, row) {


                        //  return '<a class="btn btn-danger btn-sm" href="#"> <i class="fas fa-trash" id="stergeProfesor" onClick=" deleteTeacher(' + row.id + ')" >  </i > </a><a class="btn btn-danger btn-sm" href="#"> <i data-toggle="modal" data-target="#modal-default" class="fas fa-pencil-alt" id="editTeacher" onClick=" teacherDetails(' + row.id + ')" >  </i > </a>'
                        return `<div class="dropdown">
                                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                    <span class="flaticon-more-button-of-three-dots"></span>
                                                </a>
                                                <div class="dropdown-menu dropdown-menu-right">
                                                    <a class="dropdown-item" href="#" id="trimiteMesaj" onClick="trimiteMesaj(`+ row.idUtilizator + `)"><i class="far fa-envelope"></i>Trimite-i un mesaj</a>
                                               
                                                    
                                                   
                                                </div>
                                            </div>`
                    }
                }




            ]




        });

    } catch (e) {
        alert(e.message);
    }

}
function getStudentFailedExams(idUtilizator) {
    var o = 0;
    jQuery.noConflict();
    jQuery.ajax({
        url: "https://localhost:44388/api/getStudentGradeByIdOfUser?idUtilizator=" + idUtilizator + "",
        type: "get",
        dataType: "json",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: function (data) {

            for (i = 0; i < data.length; i++) {
                if (data[i].nota < 5) {
                    o++;
                }
            }
            jQuery(".totalRestante").html(o);
           
        }

    });
}
function countTotalGradesById(idUtilizator) {

    jQuery.noConflict();
    jQuery.ajax({
        url: "https://localhost:44388/api/getStudentGradeByIdOfUser?idUtilizator=" + idUtilizator + "",
        type: "get",
        dataType: "json",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: function (data) {
            var count = Object.keys(data).length;

            jQuery(".totalNoteObtinute").html(count);

        }

    });
}
function getStudentGradeById(idUtilizator) {

    jQuery.noConflict();
    jQuery.ajax({
        url: "https://localhost:44388/api/getStudentGradeByIdOfUser?idUtilizator=" + idUtilizator +"",
        type: "get",
        dataType: "json",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: getStudentGradeByIdT

    });
}
function getStudentGradeByIdT(data) {
    jQuery.noConflict();

    try {

        jQuery('#tabelNote').DataTable({
            "aaData": data,
            "aoColumns": [
               
             
              
                {
                    "mData": "numeMaterie"
                },
                {
                    "mData": "nota"
                },
                {
                    "mData": "semestru"
                },
                {
                    "mData": "anStudiu"
                }
               



            ]




        });

    } catch (e) {
        alert(e.message);
    }

}
jQuery(function () {

    jQuery('#loginBTN').click(function (event) {
        event.preventDefault();

        login();



    });
    jQuery('#logoutBTN').click(function (event) {
        event.preventDefault();

        preLogOut();

    });

    jQuery('#btnIncarcaStudentiInscrisi').on('click', function () {
        window.location.href = '/students.html';

    });
    jQuery("#btnActualizeazaInformatii").click(function (event) {
        var userAIDI = localStorage.getItem('idUtilizator');
        event.preventDefault();
        updateData();
       
    });
    jQuery('#incarcaConturi').on('click', 'stergeCont', function () {
        stergeCont(id_utilizator);
        
        window.location.reload();
    });


    jQuery('#AdminEditUserProfile').click(function (event) {
       

            // show Modal
        $('#modal-AdminEditUserProfile').modal('show');
        
    });
   
    jQuery("#modificaSpecializare").click(function () {

        // show Modal
        $('#modal-AdminEditSpec').modal('show');
    });
    jQuery("#btnEvaluazaStudent").click(function () {

        // show Modal
        
        $('#add-grade-modal').modal('show');
        
       
    });

    jQuery('#add-grade-modal').on('hidden.bs.modal', function (e) {
        window.location.reload();
    })
    jQuery('#tblProfesori').on('click', 'editTeacher', function () {
        teacherDetails(id);

    });
    jQuery('#tblProfesori').on('click', 'deleteTeacher', function () {
        deleteTeacher(id);

    });
    jQuery('#btnModificaMaterie').on('click', function () {
        var teacherID = localStorage.getItem('teacherId');
        setTeacherCourseById(teacherID);
        // window.location.reload();

    });
    jQuery('#editTeacher').click(function (event) {


        // show Modal
        $('#modal-AdminSetTeacherCourseById').modal('show');

    });
    jQuery('#actualizeazaDate').on('click', function () {
        var q = localStorage.getItem('idUtilizatorr');
        updateDataAdmin(q);
       
        window.location.reload();

    });

    jQuery('#btnModificaSpecializare').on('click', function () {
        var idUtiliz = localStorage.getItem('idSpecializaree');
        editeazaSpecializare(idUtiliz);
        window.location.reload();



    });
    jQuery('#btnSetGrade').click(function (event) {
        event.preventDefault();

        insertAGrade();
        var xxa = localStorage.getItem("idMatContor");
       

    });
    jQuery('#btnCreateExam').click(function (event) {
        event.preventDefault();

        createExam();
        window.location.reload();
    });
    jQuery('#btnPromoveazaSpecializarea').click(function (event) {
        event.preventDefault();
        var anStudiu = document.getElementById('inputAnCurent').value;
        if (anStudiu == 1) {
            promoveazaAnul(60);
        } else if (anStudiu == 2) {
            promoveazaAnul(120);
        } else if (anStudiu == 3) {
            promoveazaAnul(180);
        } else if (anStudiu == 4) {
            promoveazaAnul(240);
        }
       

    });
    jQuery('#btnCreateProgram').click(function (event) {
        event.preventDefault();

        creeazaSpecializare();

    });
    jQuery('#recoverBTN').click(function (event) {
        event.preventDefault();

        recoverPassword();
     //   $('#parola-modal').modal('show');

    });
    jQuery('#recoverBTN').click(function (event) {


        // show Modal
       jQuery('#parola-modal').modal('show');

    });
    jQuery('#btnCreateAccount').click(function (event) {
        event.preventDefault();

        createANewUser();

    });
    var userAIDI = localStorage.getItem('idUtilizator');
    var k = localStorage.getItem('idMaterieSetat');
    var z = localStorage.getItem('idSpecializareSetat');
  
  
    console.log("Materie : " + k);
    console.log("Specializare : " + z);
    studentiInscrisi(z, k);
   
  //  loadExamListById(userAIDI);
    var userAIDI = localStorage.getItem("idUtilizator");
    loadProfile();
    loadExamListById(userAIDI);
    getAllCourses();
    getAllCourseWhereTeacherTeach(userAIDI);
    getNumberOfAccounts();
    getNumberOfPrograms();
    getNumberOfTeachers();
    incarcaSpec();
    incarcaSpecializarilePentruPromovare();
  //  loadProfile();
    fillModalEditUserData();
    fillModalProfile();
    //venitGenerat(userAIDI);
  //  getAllCourseWhereTeacherTeach(userAIDI);
  //  countTeacherExams(userAIDI);
    incarcaConturiA();
    loadAllTeachers();
    getAllCourses();
    getAllRoles();
    aduSpecializarilePtRegister();

});
