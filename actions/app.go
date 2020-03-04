package actions

import (
	"fmt"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/envy"
	forcessl "github.com/gobuffalo/mw-forcessl"
	paramlogger "github.com/gobuffalo/mw-paramlogger"
	"github.com/gorilla/mux"
	"github.com/unrolled/secure"
	"net/http"

	"github.com/RedHatGov/ocdb/actions/api"
	"github.com/RedHatGov/ocdb/pkg/cac"
	"github.com/RedHatGov/ocdb/pkg/static"
	"github.com/RedHatGov/ocdb/pkg/utils"
	csrf "github.com/gobuffalo/mw-csrf"
	i18n "github.com/gobuffalo/mw-i18n"
	"github.com/gobuffalo/packr/v2"
)

// ENV is used to help switch settings based on where the
// application is being run. Default is "development".
var ENV = envy.Get("GO_ENV", "development")
var app *buffalo.App
var T *i18n.Translator

// App is where all routes and middleware for buffalo
// should be defined. This is the nerve center of your
// application.
//
// Routing, middleware, groups, etc... are declared TOP -> DOWN.
// This means if you add a middleware to `app` *after* declaring a
// group, that group will NOT have that new middleware. The same
// is true of resource declarations as well.
//
// It also means that routes are checked in the order they are declared.
// `ServeFiles` is a CATCH-ALL route, so it should always be
// placed last in the route declarations, as it will prevent routes
// declared after it to never be called.
func App() *buffalo.App {
	if app == nil {
		app = buffalo.New(buffalo.Options{
			Env:         ENV,
			SessionName: "_ocdb_session",
		})

		// Automatically redirect to SSL
		app.Use(forceSSL())

		// Log request parameters (filters apply).
		app.Use(paramlogger.ParameterLogger)

		// Protect against CSRF attacks. https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)
		// Remove to disable this.
		app.Use(csrf.New)

		// Wraps each request in a transaction.
		//  c.Value("tx").(*pop.Connection)
		// Remove to disable this.
		//app.Use(popmw.Transaction(models.DB))

		// Setup and use translations:
		app.Use(translations())

		app.GET("/", PatternflyReactHandler)
		app.GET("/ato/{whatever}", PatternflyReactHandler)
		app.GET("/ato/{whatever}/{whatever}", PatternflyReactHandler)
		app.GET("/ato/{whatever}/{whatever}/{whatever}", PatternflyReactHandler)

		// Support old links from v1 site
		app.GET("/product-documents/{whatever}", PatternflyReactHandler)
		app.GET("/product-documents/{whatever}/nist-800-53/{whatever}/", PatternflyReactHandler)

		apiV1 := app.Group("/api/v1/")
		apiV1.Resource("/standards", api.StandardsResource{&buffalo.BaseResource{}})
		apiV1.Resource("/components", api.ComponentsResource{&buffalo.BaseResource{}})
		apiV1.GET("/components/{component_id}/controls", api.ComponentControlsHandler)
		apiV1.GET("/components/{component_id}/fedramp/{level}", api.ComponentFedrampHandler)

		//myStaticServer(app)
		//app.ServeFiles("/cac/", cac.HttpFiles())
		cac.RegisterStaticHandler(app)

		app.ServeFiles("/ssg/build", http.Dir("/tmp/.scap_cache/build"))
		app.ServeFiles("/", static.AssetsBox) // serve files from the public directory
		utils.SetLogger(app.Logger)

	}

	return app
}
func myStaticServer(app *buffalo.App) {

	dir := "/tmp/.scap_cache/build"
	r := mux.NewRouter()
	// This will serve files under http://localhost:8000/static/<filename>
	r.PathPrefix("/guides/").Handler(http.StripPrefix("/guides/", http.FileServer(http.Dir(dir+"/guides/"))))
	r.PathPrefix("/").Handler(http.FileServer(http.Dir(dir)))
	app.Mount("/CAC", r)
	app.Mount("/ZZZ", http.FileServer(http.Dir(dir)))
}

func myStaticServer3(app *buffalo.App) {
	dir := "/tmp/.scap_cache/build"
	//r := mux.NewRouter()
	// This will serve files under http://localhost:8000/static/<filename>
	//r.PathPrefix("/xxx/").Handler(http.StripPrefix("/xxx/", http.FileServer(http.Dir(dir))))
	//app.Mount("/YYY", http.FileServer(http.Dir(dir)))
	app.Mount("/YYY", http.FileServer(http.Dir(dir)))
}

func myStaticServer2(app *buffalo.App) {

	dir := "/tmp/.scap_cache/build"
	r := mux.NewRouter()
	// This will serve files under http://localhost:8000/static/<filename>
	r.PathPrefix("/xxx/").Handler(http.StripPrefix("/xxx/", http.FileServer(http.Dir(dir))))
	app.Mount("/YYY", r)
}

func muxer(app *buffalo.App) http.Handler {
	f := func(res http.ResponseWriter, req *http.Request) {
		app.Logger.Info("AHOJ XXX")
		fmt.Fprintf(res, "XXX %s - %s", req.Method, req.URL.String())
	}
	mux := mux.NewRouter()

	mux.HandleFunc("/foo", f)
	mux.HandleFunc("/bar", f)
	mux.HandleFunc("/baz/baz", f)
	return mux
}

// translations will load locale files, set up the translator `actions.T`,
// and will return a middleware to use to load the correct locale for each
// request.
// for more information: https://gobuffalo.io/en/docs/localization
func translations() buffalo.MiddlewareFunc {
	var err error
	if T, err = i18n.New(packr.New("app:locales", "../locales"), "en-US"); err != nil {
		app.Stop(err)
	}
	return T.Middleware()
}

// forceSSL will return a middleware that will redirect an incoming request
// if it is not HTTPS. "http://example.com" => "https://example.com".
// This middleware does **not** enable SSL. for your application. To do that
// we recommend using a proxy: https://gobuffalo.io/en/docs/proxy
// for more information: https://github.com/unrolled/secure/
func forceSSL() buffalo.MiddlewareFunc {
	return forcessl.Middleware(secure.Options{
		SSLRedirect:     ENV == "production",
		SSLProxyHeaders: map[string]string{"X-Forwarded-Proto": "https"},
	})
}
