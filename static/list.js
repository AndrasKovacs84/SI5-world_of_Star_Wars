var swPlanetsList = (function() {
    //var paginationBtns = document.querySelectorAll("[data-pagination]");
    // VARIABLES NOT AVAILABLE OUTSIDE:
    //paginationBtns.forEach(btn => btn.addEventListener("click", getPageData($(this).attr('data-pagination'))));
    var residentList = '';
    var apiLink = "http://swapi.co/api/planets";
    $('button[data-pagination]').click(function () {
        var newPage = $(this).attr('data-pagination');
        getPageData(newPage);
    });

    $('#toggleLoginForm').click(function(e) {
        $('#login').slideDown(200);
        $('#register').slideUp(200);
        $('.flash').dequeue().slideUp(200);
    });
    $('#toggleRegisterForm').click(function(e) {
        $('#register').slideDown(200);
        $('#login').slideUp(200);
        $('.flash').dequeue().slideUp(200);
    });


    $('#planet_details').on('click', '.votePlanet', function(e) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/planet_vote",
            data: JSON.stringify({planetId: $(this).attr('data-planetId'), 
                                  planetName: $(this).attr('data-planetName')}),
            dataType: "json",
            success: function(replyFromFlask) {
                        flashMessageSuccess(replyFromFlask.message);
                        }
        });
    });


    function flashMessageSuccess(message){
        $('.jquery-flash:hidden').remove();
        var messageFlash = `
                <div class="alert alert-success alert-dismissible jquery-flash" role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    ${message}
                </div>`;
        $(messageFlash).prependTo($('#voteMessageContainer')).slideDown(300).delay(1000).slideUp(300);
    }


    $('#residentsModal').on('show.bs.modal', function (event) {
        $('#residents_list tbody').empty();
        var button = $(event.relatedTarget); // Button that triggered the modal
        var planetName = button.data('planetname'); // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var residentsApiLinks = button.data('residents').split(',');
        var residentsObj = [];
        var html = '';
        var resident = ''

        $.ajax({
            url: '/residents',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(residentsApiLinks),
            dataType: "json"
        }).done(function (response){
            renderModalList(response);
        });

//        $.each(residentsApiLinks, function(i) {
//            var residentList;
//            $.ajax({
//                url: residentsApiLinks[i],
//                type: 'GET',
//                dataType: 'json'
//            }).done(function(data){
//                residentsObj.push(data);
//            });
//            console.log('hlo', residentsObj);
//        });
//        renderModalList(residentsObj);
//        $(html).appendTo("#residents_list");
//        var modal = $(this);
//        modal.find('.modal-title').text('Residents of ' + planetName);
    })


    function renderModalList(residentsObj) {
        var html = '';
        $.each(residentsObj, function (i, resident) {
            html += '<tr>';
            html += `<td>${resident.name}</td>`;
            html += `<td>${resident.height}</td>`;
            html += `<td>${resident.mass}</td>`;
            html += `<td>${resident.hair_color}</td>`;
            html += `<td>${resident.skin_color}</td>`;
            html += `<td>${resident.eye_color}</td>`;
            html += `<td>${resident.birth_year}</td>`;
            html += `<td>${resident.gender}</td>`;
            html += '</tr>'
        })
        $(html).appendTo("#residents_list");
    }


    function addResidentToTable(resident) {
        var html = '';
        html += '<tr>';
        html += `<td>${resident.name}</td>`;
        html += `<td>${resident.height}</td>`;
        html += `<td>${resident.mass}</td>`;
        html += `<td>${resident.hair_color}</td>`;
        html += `<td>${resident.skin_color}</td>`;
        html += `<td>${resident.eye_color}</td>`;
        html += `<td>${resident.birth_year}</td>`;
        html += `<td>${resident.gender}</td>`;
        html += '</tr'
        return html;
    }


    // FUNCTIONS NOT AVAILABLE OUTSIDE
    function getPageData(apiURL) {
        $.ajax({
            url: apiURL,
            type: 'GET',
            success: function(data){
                renderList(data);
            }
        });
    }


    function formatNumberAndAddUnit(numberToFormat, unitToAdd) {
        if (numberToFormat !== "unknown") {
            return numberToFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + unitToAdd;
        } else {
            return numberToFormat;
        }
    }


    function formatResidentsField(listOfResidents, planet) {
        if (listOfResidents != 0) {
            var btn = `<button type="button" class="btn btn-default btn-sm btnResidents" 
                        data-planetName="${planet}" 
                        data-residents="${listOfResidents}"
                        data-toggle="modal" 
                        data-target="#residentsModal">${listOfResidents.length} residents</button>`;
            return btn;
        } else {
            return "No known residents";
        }
    }


    function renderList(data) {
        $('#planet_details thead').empty();
        var header = '';
        if ($('#loginStatus').attr('data-user')) {
            header += "<th>Vote</th>";
        }
        header += "<th>Name</th><th>Diameter</th><th>Climate</th><th>Gravity</th><th>Terrain</th><th>Surface water</th><th>Population</th><th>Residents</th>";
        $('#planet_details thead').append(header)
        $('#planet_details tbody').empty();
        $.each(data.results, function (i, planet) {
            var html = "<tr>";
            if ($('#loginStatus').attr('data-user')) {
                var btn = '<button type="button" class="btn btn-default btn-sm votePlanet" data-planetName="'+ planet.name + '" data-planetId='+ planet.url.slice(-2, -1) +' ><span class="glyphicon glyphicon-thumbs-up"></span></button>';
                html += "<td>" + btn + "</td>";
            }
            html +="<td>"+planet.name+"</td>";
            html +="<td>"+formatNumberAndAddUnit(planet.diameter, "km")+"</td>";
            html +="<td>"+planet.climate+"</td>";
            html +="<td>"+planet.gravity+"</td>";
            html +="<td>"+planet.terrain+"</td>";
            html +="<td>"+formatNumberAndAddUnit(planet.surface_water, "%")+"</td>";
            html +="<td>"+formatNumberAndAddUnit(planet.population, "people")+"</td>";
            html +="<td>"+formatResidentsField(planet.residents, planet.name)+"</td>";
            html += "</tr>";
            $(html).appendTo("#planet_details");
        });
        $('button:contains("Next")').attr('data-pagination', data.next);
        $('button:contains("Previous")').attr('data-pagination', data.previous);

        // disable/enable next button if next page exists
        if ($('button:contains("Next")').attr('data-pagination') == undefined) {
            $('button:contains("Next")').prop('disabled', true);
        } else if ($('button:contains("Next")').attr('data-pagination') != undefined) {
            $('button:contains("Next")').prop('disabled', false);
        } 
        
        // disable/enable previous button if previous page exists
        if ($('button:contains("Previous")').attr('data-pagination') == undefined) {
            $('button:contains("Previous")').prop('disabled', true);
        } else if ($('button:contains("Previous")').attr('data-pagination') != undefined) {
            $('button:contains("Previous")').prop('disabled', false);
        }
    }


    $(document).ready(function(e) {
        getPageData(apiLink);
        $('#login').hide();
        $('#register').hide();
        $('.flash').delay(3000).slideUp(1000);
    })

    // FUNCTIONS AVAILABLE OUTSIDE
    return {
    
        a_func: function() {
            console.log($('button[data-planetid]'));
        },

        b_func: function() {
            a_func(); // this function can also access my_var
        }
    };

})();
