var swPlanetsList = (function() {
    //var paginationBtns = document.querySelectorAll("[data-pagination]");
    // VARIABLES NOT AVAILABLE OUTSIDE:
    //paginationBtns.forEach(btn => btn.addEventListener("click", getPageData($(this).attr('data-pagination'))));
    var apiLink = "http://swapi.co/api/planets"
    $('button[data-pagination]').click(function () {
        var newPage = $(this).attr('data-pagination');
        getPageData(newPage);
    });

    $('#toggleLoginForm').click(function(e) {
        $('#login').slideDown(200);
        $('#register').slideUp(200);
    });
    $('#toggleRegisterForm').click(function(e) {
        $('#register').slideDown(200);
        $('#login').slideUp(200);
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
                        alert(replyFromFlask.message);
                        }
        });
    });
    
    
    function pageChange(){

    }


    // FUNCTIONS NOT AVAILABLE OUTSIDE
    function getPageData(apiURL) {
        var page = '';
        var pageData = $.ajax({
            url: apiURL,
            type: 'GET',
            success: function(data){
                renderList(data);
            }
        });
        return pageData;
    }


    function formatNumberAndAddUnit(numberToFormat, unitToAdd) {
        if (numberToFormat !== "unknown") {
            return numberToFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + unitToAdd;
        } else {
            return numberToFormat;
        }
    }


    function formatResidentsField(listOfResidents) {
        if (listOfResidents != 0) {
            var btn = '<button type="button" class="btn btn-default btn-sm" data-residents='+ listOfResidents +' >'+ listOfResidents.length + ' residents</button>';
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
        //$(header).appendTo("#planet_details");
        //$('#planet_details thead').html(header)
        $('#planet_details thead').append(header)
        $('#planet_details tbody').empty();
        $.each(data.results, function (i, planet) {
            html = "<tr>";
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
            html +="<td>"+formatResidentsField(planet.residents)+"</td>";
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


//    $.each(voteBtns, function(i, btn) {
//        btn.click(function(e){
//            console.log(e);
//        });
//    });


    $(document).ready(function(e) {
        getPageData(apiLink);
        $('#login').hide();
        $('#register').hide();
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
