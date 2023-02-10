function searchBarOnKeyDown(event) {
    if (event.which == 13) {
        searchButtonOnClick();
    }
}

function searchButtonOnClick() {
    let rootName = document.getElementById("searchBar").value;
    let rela = document.getElementById("rela").value;
    if(rela ==="SW belongs to"){
        rela = "SW_belongs_to";
    }else if(rela === "managed by"){
        rela = "managed_by";
    }else if(rela === "company locate in city"){
        rela = "company_locate_in_city";
    }else if(rela === "work for"){
        rela = "work_for";
    }else if(rela === "hold"){
        rela = "hold";
    }else if(rela === "same industry") {
        rela = "same_industry";
    }else if(rela === "rise"){
        rela = "rise";
    }else if(rela === "compete"){
        rela = "compete";
    }else if(rela === "cooperate"){
        rela = "cooperate";
    }else if(rela === "increase holding"){
        rela = "increase_holding";
    }else if(rela === "fall"){
        rela = "fall";
    }else if(rela === "supply"){
        rela = "supply";
    }else if(rela === "be reduced holding"){
        rela = "be_reduced_holding";
    }else if(rela === "be invested"){
        rela = "be_invested";
    }else if(rela === "reduce holding"){
        rela = "reduce_holding";
    }else if(rela === "superior"){
        rela = "superior";
    }else if(rela === "be increased holding"){
        rela = "be_increased_holding";
    }else if(rela === "subordinate"){
        rela = "subordinate";
    }else if(rela === "invest"){
        rela = "invest";
    }else if(rela === "dispute"){
        rela = "dispute";
    }else if(rela === "be supplied"){
        rela = "be_supplied";
    }else {
        rela = "all";
    }

    windowManager.reset();
    if (rootName === "") {
        windowManager.addNodes([
            new Node("000001.SH", windowManager.windowWidth/2 + 10, windowManager.windowHeight/2, 0,"all"),
            new Node("000002.SH", windowManager.windowWidth/2 - 10, windowManager.windowHeight/2, 0,"all")
        ]);
    } else {
        windowManager.addNodes([
            new Node(rootName, windowManager.windowWidth / 2, windowManager.windowHeight / 2, 0,rela)
        ])
    }
}

function searchByRootName() {
    windowManager.reset();
    windowManager.addNodes([
        new Node("000001.SH", windowManager.windowWidth/2 + 10, windowManager.windowHeight/2, 0,"all"),
        new Node("000002.SH", windowManager.windowWidth/2 - 10, windowManager.windowHeight/2, 0,"all")
    ]);
}