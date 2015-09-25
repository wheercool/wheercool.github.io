var widgetRegister = {
    url: 'data/target.json',
    el: '#dashboard',
    register: function(name, widget) {
        this.__widgets[name] = widget;
    },
    drawAll: function() {
        var el = this.el;
        var widgets = this.__widgets;
        d3.json(this.url, function(err, data) {
            var sizes = {
                "large": "col-md-12",
                "medium": "col-md-6",
                "small": "col-md-4"
            };

            buildDynamicMenu(el, data);

            var row = d3.select(el)
                .append('div')
                // .classed('container', true)
                .append('div')
                .classed('row', true);

            var panel = row.selectAll('.widget')
                .data(data.widgets)
                .enter()
                .append('div')
                    .attr('class', function(d) {
                        return 'widget ' + sizes[d.settings.size];
                    })
                    .append('div')
                    .attr('class', 'panel panel-default');

                    panel.append('div')
                        .attr('class', 'panel-heading')
                        .html(function(d) { return '<a class="anchor" name="' + d.name + '"></a><h5>'+ d.settings.title + '</h5>';})

                    panel.append('div')
                        .attr('class', 'panel-body')
                        .each(function(d) {
                            widgets[d.name](this, d.dataset, d.generalData, d.settings);
                        })
        });
        
        
    },

    __widgets: []
};

function buildDynamicMenu(el, data) {
    var nav = d3.select('.widget-search')
        .select('ul')
        .selectAll('li')
        .data(data.widgets)
        .enter()
        .append('li')
        .append('a')
        .attr('href', function(d) {return  '#' + d.name})
        .html(function(d) { return d.settings.title});

    d3.select('.navbar-brand')
        .text(data.generalSettings && data.generalSettings.client || 'Easy Intelligence')
}