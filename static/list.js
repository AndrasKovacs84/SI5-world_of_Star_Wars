var swPlanetsList = (function() {
    // VARIABLES NOT AVAILABLE OUTSIDE:
    var paginationBtns = document.querySelectorAll("[data-pagination]");
    paginationBtns.forEach(btn => btn.addEventListener("click", pageChange));
    var apiLink = "http://swapi.co/api/planets"

    function pageChange(){

    }

    // FUNCTIONS NOT AVAILABLE OUTSIDE
    function getPageData(apiURL) {
        var page = '';
        var pageData = $.ajax({
            url: apiLink,
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
        $.each(data.results, function (i, planet) {
            html = "<tr>";
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
    }


    // FUNCTIONS AVAILABLE OUTSIDE
    return {
    
        a_func: function() {
            getPageData(apiLink);
        },

        b_func: function() {
            a_func(); // this function can also access my_var
        }
    };

})();
