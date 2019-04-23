$(document).ready(function () {
    let maxPeople;
    let listPeople;
    let listGroup;
    $("#peopleList").change(function () {
        $('#dataTable').html('');
        let url = getObjectURL(this.files[0]);
        $.ajax({
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            url: url,
            type: "GET",
            dataType: 'text',
            success: function (getCsv) {
                let getData = getCsv.split("\r\n");
                listPeople = getData;
                maxPeople = getData.length - 1;
                getData.forEach(function (e, i) {
                    dataShow(e, i);
                });
            }
        });
    });

    $('#groupBtn').click(() => {
        let groupIndex = 1;
        let group = {};
        let num;
        for (let i = 0; i < $('#groupNum').val(); i++) {
            group['group' + (i + 1)] = [];
        }
        for (let i = 0; i < maxPeople; i++) {
            let bo = true;
            while (bo == true) {
                num = getRandom(1, maxPeople);
                for (let j = 1; j <= $('#groupNum').val(); j++) {
                    if (group['group' + j].indexOf(num) != -1) {
                        bo = true;
                        break;
                    } else {
                        bo = false;
                    }
                }
            }
            group['group' + groupIndex].push(num);
            if (groupIndex == $('#groupNum').val())
                groupIndex = 1;
            else
                groupIndex++;
        }
        listGroup = groupShow(group, listPeople);
    });

    $('#outPutpBtn').click(() => {
        let downloadLink = document.createElement("a");
        downloadLink.download = "分組名單.csv";
        downloadLink.innerHTML = "Download File";
        if (window.webkitURL != null) {
            const code = encodeURIComponent(listGroup);
            if (navigator.appVersion.indexOf("Win") == -1)
                downloadLink.href = "data:application/csv;charset=utf-8," + code;
            else
                downloadLink.href = "data:application/csv;charset=utf-8,%EF%BB%BF" + code;

        }
        downloadLink.click();
    })
});

function getObjectURL(file) {
    let url = null;
    if (window.createObjcectURL != undefined) {
        url = window.createOjcectURL(file);
    } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

function dataShow(groupData, i) {
    let data = groupData.split(',');
    let tableString = (i == 0) ? '<tr><td>編號</td>' : '<tr>';
    data.forEach(function (e, j) {
        tableString += (i != 0 && j == 0) ? '<td>' + i + '</td><td>' + e + '</td>' : '<td>' + e + '</td>';
    });
    tableString += '</tr>';
    $('#dataTable').append(tableString);
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function groupShow(group, listPeople) {
    $('#groupTable').html('');
    let tableString = '';
    let listGroup = '';
    for (let i = 1; i <= $('#groupNum').val(); i++) {
        listGroup += '第' + i + '組,';
        tableString += '<tr><td>第' + i + '組</td><td>';
        for (let j = 0; j < group['group' + i].length; j++) {
            let listPerson = listPeople[group['group' + i][j]].split(',');
            if (j == group['group' + i].length - 1) {
                tableString += listPerson[0] + listPerson[1];
                listGroup += listPerson[0] + listPerson[1];
            } else {
                tableString += listPerson[0] + listPerson[1] + ',';
                listGroup += listPerson[0] + listPerson[1] + ','
            }

        }
        tableString += '</td></tr>';
        listGroup += "\r\n";
    }
    $('#groupTable').append(tableString);
    return listGroup;
}