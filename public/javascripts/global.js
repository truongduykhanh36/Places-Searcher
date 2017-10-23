// DOM Ready =========================================
$(document).ready(function () {
    $('#btn-search').on('click', searchForPlaces);
    $('#txt-search').on('keydown', function (e) {
        if (e.keyCode == 13) {
            $('#btn-search').click();
        }
    });
    $('#search-results').on('click', '.x_panel', getRecentMedia);
    $('#recent-media-results').on('click', '.x_panel', goToMediaLink);
});

// Functions =========================================
function searchForPlaces() {
    clearResults();
    if ($('#txt-search').val() === '') return;

    $.getJSON('/api//address-to-lat-long/' + $('#txt-search').val(), function (geoCodeData) {
        if (geoCodeData.stt === 'ng') {
            return;
        }
        else {
            let lat = geoCodeData.geometry.lat;
            let long = geoCodeData.geometry.long;

            $.getJSON('/api/search-nearby-places/' + lat + '&' + long, populateResult)
        }
    })
}

function getRecentMedia(event) {
    clearMediaResults();
    let placeId = $(this).attr('data-place-id');
    $.getJSON('/api/get-recent-media/' + placeId, function (data) {
        populateMediaResult(data);
    });
}

// Helper Functions ==================================
function clearResults() {
    $('#search-results').html('');
}

function clearMediaResults() {
    $('#recent-media-results').html('');
}

function populateResult(placesData) {
    let resultContent = '';
    for (let i = 0; i < placesData.data.length; i++) {
        resultContent += '\n' +
            '        <div class="x_panel" data-place-id="' + placesData.data[i].id + '">\n' +
            '            <div class="x_title">\n' +
            '                <h2>' + (i + 1) + '<small>' + placesData.data[i].name + '</small></h2>\n' +
            '                <div class="clearfix"></div>\n' +
            '            </div>\n' +
            '        </div>';
    }

    $('#search-results').html(resultContent);
}

function populateMediaResult(data) {
    let mediaResultContent = '';
    for (let i = 0; i < data.length; i++) {
        mediaResultContent += '<div class="x_panel" data-link="' + data[i].link + '">\n' +
            '    <div class="x_content">\n' +
            '       <div style="margin:7px">\n' +
            '           <a href="javascript:;" class="user-profile" aria-expanded="false">\n' +
            '               <img src="' + data[i].avatar + '" alt="">' + data[i].name + '\n' +
            '           </a>\n' +
            '       </div>\n' +
            '       <div>\n' +
            '           <img style="width: 100%; display: block;" src="' + data[i].image + '" alt="image" />\n' +
            '       </div>\n' +
            '    </div>\n' +
            '</div>';
    }

    $('#recent-media-results').html(mediaResultContent);
}

function goToMediaLink() {
    let link = $(this).attr('data-link');
    window.open(link);
}

