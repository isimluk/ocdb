package translation

import (
	"sync"

	"github.com/gobuffalo/mw-i18n/internal/go-i18n/i18n/language"
)

type singleTranslation struct {
	id       string
	template *template
	moot     sync.RWMutex
}

func (st *singleTranslation) MarshalInterface() interface{} {
	return map[string]interface{}{
		"id":          st.id,
		"translation": st.template,
	}
}

func (st *singleTranslation) MarshalFlatInterface() interface{} {
	return map[string]interface{}{"other": st.template}
}

func (st *singleTranslation) ID() string {
	return st.id
}

func (st *singleTranslation) Template(pc language.Plural) *template {
	st.moot.RLock()
	defer st.moot.RUnlock()
	return st.template
}

func (st *singleTranslation) UntranslatedCopy() Translation {
	return &singleTranslation{st.id, mustNewTemplate(""), sync.RWMutex{}}
}

func (st *singleTranslation) Normalize(language *language.Language) Translation {
	return st
}

func (st *singleTranslation) Backfill(src Translation) Translation {
	st.moot.Lock()
	if (st.template == nil || st.template.src == "") && src != nil {
		st.template = src.Template(language.Other)
	}
	st.moot.Unlock()
	return st
}

func (st *singleTranslation) Merge(t Translation) Translation {
	other, ok := t.(*singleTranslation)
	if !ok || st.ID() != t.ID() {
		return t
	}
	st.moot.Lock()
	if other.template != nil && other.template.src != "" {
		st.template = other.template
	}
	st.moot.Unlock()
	return st
}

func (st *singleTranslation) Incomplete(l *language.Language) bool {
	st.moot.RLock()
	defer st.moot.RUnlock()
	return st.template == nil || st.template.src == ""
}

var _ = Translation(&singleTranslation{})
