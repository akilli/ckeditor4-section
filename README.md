# Section Widget

This widget offers the possibility to add a configurable amount of *similar structured* sections into the editor and make them distinguishable by custom CSS classes, so you can apply different styles on them.

*Similar structured* is not quite accurate. It just means, that all configured sections will have three editables: heading, media element and content. But all of them are optional. 

If all editables are filled with content, the resulting HTML will be

    <section class="...">
        <h2>...</h2>
        <figure class="...">...</figure>
        <div class="content">...</div>
    </section>  

The configuration expects an object with one or several CSS classes as the properties and the corresponding labels visible in the section dialog as the values, p.e.

    config.section: {'block-content': 'Inhaltsblock', 'block-info': 'Infoblock'};

You have to configure at least one type otherwise this widget will not initialize itself. 

## Demo

https://akilli.github.io/rte/ck4
