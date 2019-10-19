package fedramp

import (
	"errors"
	"github.com/RedHatGov/ocdb/pkg/masonry"
	"github.com/RedHatGov/ocdb/pkg/static"
	"github.com/opencontrol/fedramp-templater/opencontrols"
	"github.com/opencontrol/fedramp-templater/ssp"
	"github.com/opencontrol/fedramp-templater/templater"
	"io/ioutil"
	"os"
	"path/filepath"
)

const masonryPath = "/tmp/.masonry_cache/"
const fedrampPath = "/tmp/.fedramp_cache/"
const fedrampDocPath = "/tmp/.fedramp_cache/fedramp.docx"
const sspDocTemplate = "FedRAMP-System-Security-Plan-Template-v2.1.docx"

type FedrampDocument struct {
	Bytes  []byte
	Errors []error
}

func buildCache() *map[string]FedrampDocument {
	ms := masonry.GetInstance()
	result := make(map[string]FedrampDocument)
	for _, component := range (*ms).GetAllComponents() {
		bytes, errors := buildFor(component.GetKey())
		result[component.GetKey()] = FedrampDocument{bytes, errors}
	}
	return &result
}

func fedrampTemplate() (*ssp.Document, []error) {
	docBytes, err := static.AssetsBox.Find("assets/" + sspDocTemplate)
	if err != nil {
		return nil, []error{err, errors.New("Assets pack does not contain FEDRAMP template: " + sspDocTemplate)}
	}
	ioutil.WriteFile("/tmp/"+sspDocTemplate, docBytes, 0600)

	doc, err := ssp.Load("/tmp/" + sspDocTemplate)
	if err != nil {
		return nil, []error{err, errors.New("Could not open FEDRAMP template: /tmp/" + sspDocTemplate)}
	}
	return doc, nil
}

// Get the fedramp document for given component
func buildFor(componentId string) ([]byte, []error) {
	err := os.RemoveAll(fedrampPath)
	if err != nil {
		return nil, []error{err}
	}
	err = os.MkdirAll(fedrampPath+"/components/"+componentId+"/", 0700)
	if err != nil {
		return nil, []error{err}
	}
	err = os.MkdirAll(fedrampPath+"/standards", 0700)
	if err != nil {
		return nil, []error{err}
	}
	err = os.Symlink(masonryPath+"/components/"+componentId+"/component.yaml", fedrampPath+"/components/"+componentId+"/component.yaml")
	if err != nil {
		return nil, []error{err}
	}

	openControlData, errs := opencontrols.LoadFrom(fedrampPath)
	if len(errs) != 0 {
		return nil, errs
	}
	doc, errs := fedrampTemplate()
	if len(errs) != 0 {
		return nil, errs
	}
	defer doc.Close()

	err = templater.TemplatizeSSP(doc, openControlData)
	if err != nil {
		return nil, []error{err}
	}

	outputDir := filepath.Dir(fedrampDocPath)
	err = os.MkdirAll(outputDir, 0700)
	if err != nil {
		return nil, []error{err}
	}
	err = doc.CopyTo(fedrampDocPath)
	if err != nil {
		return nil, []error{err}
	}

	data, err := ioutil.ReadFile(fedrampDocPath)
	if err != nil {
		return nil, []error{err}
	}

	return data, nil
}