var widgetRegister = {
    url: 'data/target-jsonp-with-full-settings.json',
    el: '#dashboard',
    __widgetsObj: {},
    register: function(name, widget) {
        this.__widgets[name] = widget;
    },
    drawAll: function() {
        d3.select('body')
            .append('script')
            .attr('src', this.url);

    },
    onSuccess: function (data) {
           var el = widgetRegister.el;
           var widgets = widgetRegister.__widgets;
            var sizes = {
                "large": "col-md-12",
                "medium": "col-md-6",
                "small": "col-md-4"
            };
            d3.select('.waiting')
                .style('display', 'none');

                
            buildDynamicMenu(el, data);
            d3.select('body')
                .style('background-color', data.generalSettings.backgroundColor || "#eee")


            // var row = d3.select(el)
            //     .append('div')
            //     // .classed('container', true)
            //     .append('div')
            //     .classed('row', true)
            //     .classed('sortable', true)

        var panel = d3.select(widgetRegister.el)
                .select('.tab-content')
                .selectAll('.tab-pane')
                .data(data.widgets)
                .enter()
                .append('div')
                .attr('class', 'tab-pane')
                .attr('role', 'tabpanel')
                .attr('id', function(d) { return beatufy(d.name)})
                .append('div')
                .attr('class', 'row')


            // var panel = row.selectAll('.widget')
            //     .data(data.widgets)
            //     .enter()
                .append('div')
                    .attr('class', function(d) {
                        return 'widget ' + sizes[d.settings.size || "large"];
                    })
                    .append('div')
                    .attr('class', 'panel panel-default');

                    panel.append('div')
                        .attr('class', 'panel-heading')
                        .html(function(d) { return /*'<a class="anchor" name="' + d.name + '"></a>*/'<h5>'+ d.settings.context || d.settings.title + '</h5>';})

                    panel.append('div')
                        .attr('class', 'panel-body')
                        .each(function(d) {
                            // if (d.name == 'Department Insight') return;
                            // widgets[d.name](this, d.dataset, d.generalData, d.settings);
                        })

                $('.my-tab-menu a').click(function (e) {
                   var name = $(this).attr('name');
                   var datum = data.widgets.filter(function(d) { return d.name == name })[0];
                   var el = d3.select(d3.select(this).attr('href'))
                            .select('.panel-body');

                   
                  e.preventDefault();
                  $(this).tab('show');
                  

                  if (el.attr('data-cached')) {
                        //widgets[name].
                        if (widgetRegister.__widgetsObj[name] && widgetRegister.__widgetsObj[name].activate) {
                            widgetRegister.__widgetsObj[name].activate();
                        }
                  };

                   widgetRegister.__widgetsObj[name] = widgets[name](el.node(), datum.dataset, datum.generalData, datum.settings);
                   el.attr('data-cached', true);

                });

                $('.my-tab-menu a').first().click();

               // $(function () {
               //      $(".sortable").sortable();
               //      $(".sortable").disableSelection();
               //  });
            // d3.selectAll('.widget').on('click', launchFullScreen)
        },
    __widgets: []
};
function callback(data) {
    widgetRegister.onSuccess(data);
}
function beatufy(str) {
    return str.split(' ').join('');
}
function buildDynamicMenu(el, data) {
    var nav = d3.select(widgetRegister.el)
        .select('ul.my-tab-menu')
        .selectAll('li')
        .data(data.widgets)
        .enter()
        .append('li')
        .attr('role', 'presentation')
        .append('a')
        .attr('href', function(d) {return  '#' + beatufy(d.name)})
        .attr('aria-controls', function(d) {return  beatufy(d.name)})
        .attr('name', function(d) {return  d.name})
        // .attr('data-toggle', 'tab')
        // .attr('href', '#')
        .html(function(d) { return d.settings.title});



        d3.select(widgetRegister.el)
        .select('ul.my-tab-menu')
        // .append('div')
        // .attr('class', 'tab-content')

    // d3.select('ul.my-tab-menu')
    //     .on('click', function(d, e) {
    //         if (d3.event.target.tagName == 'A') {
    //             d3.select(this).selectAll('li')
    //                 .classed('active', false);

    //             d3.select('ul.my-tab-menu .tab-content')
    //                 .selectAll('.tab-pane')
    //                 .classed('active', function(d) {
    //                     return false;
    //                 });

    //             d3.select(d3.event.target.parentElement)
    //                 .classed('active', true);



    //         }
    //     })

   

    d3.select('.navbar-brand')
        .text(data.generalSettings && data.generalSettings.brand || 'Proof of Concept')
}

//Запустить отображение в полноэкранном режиме
function launchFullScreen(element) {
    element = this;
    if(element.requestFullScreen) {
        element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
}

function cancelFullscreen() {
    if(document.cancelFullScreen) {
        document.cancelFullScreen();
    } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if(document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
}
