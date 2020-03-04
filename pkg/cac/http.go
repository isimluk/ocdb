package cac

//import "net/http"

//func HttpFiles() http.FileSystem {
//	return http.Dir(contentCache + "/build")
//}
import (
	"fmt"
	"github.com/gobuffalo/buffalo"
	"net/http"
	"strings"
)

const directory = contentCache + "/build"

func RegisterStaticHandler(app *buffalo.App) {
	handler := http.NewServeMux()
	//handler.Handle("/statics/", http.StripPrefix(strings.TrimRight("/statics/", "/"), http.FileServer(http.Dir(directory))))
	handler.Handle("/statics/", http.StripPrefix(strings.TrimRight("/statics/", "/"), http.FileServer(customFileServer{http.Dir(directory)})))

	app.Mount("/CAC/", handler)
}

type customFileServer struct {
	fs http.FileSystem
}

func (fs customFileServer) Open(path string) (http.File, error) {

	fmt.Println("NASRAT: " + path)
	fmt.Println(fs)

	f, err := fs.fs.Open(path)
	if err != nil {
		return nil, err
	}

	s, err := f.Stat()
	if s.IsDir() {
		fmt.Println("IT IS DIR")
		index := strings.TrimSuffix(path, "/") + "/index.html"
		if _, err := fs.fs.Open(index); err != nil {
			return nil, err
		}
	}

	return f, nil
}
