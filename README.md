# angular-ui-routed-tabs

**AngularJS Bootstrap-based tabs that adhere to current ui-router state and allow easy state switching.**

Based on original [ui.bootstrap.tabs](https://angular-ui.github.io/bootstrap/#/tabs) and [ui-router-tabs](https://github.com/rpocklin/ui-router-tabs) directives. 

Doesn't depend on `angular-ui-bootstrap` directive. Depends on Bootstrap itself, though.

## Usage

```html
<routed-tabset type="pills" vertical="true">
    <routed-tab ui-sref="first" heading="First, simple"></routed-tab>
    <routed-tab ui-sref="second" other-active-routes="['third']">
        <routed-tab-heading>
            Second <small>it will be highlighted for third, too</small>
        </routed-tab-heading>
    </routed-tab>
</routed-tabset>
```

## How it differs from others?

### ui.bootstrap.tabs
`ui.bootstrap.tabs` is unaware of ui-router states. It expects you to provide the content for each tab in the markup immediately or forces you to manually do state transitions on tab click. It also expects you to keep and maintain `active` flag for each tab.

### ui-router-tabs
`ui-router-tabs` expects the list of available tabs to be provided as a `$scope` variable. It doesn't provide a way to customize headings on a one-off basis i.e. to use custom directives within the heading.

## Demo
[TODO]

## Install
1. download the files via Bower - run `bower install angular-ui-routed-tabs`
2. include the `ui-routed-tabs.min.js` file in your app
3. include the module in angular (i.e. in `app.js`) - `ui-routed-tabs`

## Licence
[MIT](LICENCE)