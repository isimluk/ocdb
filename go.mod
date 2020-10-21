module github.com/RedHatGov/ocdb

go 1.13

require (
	github.com/Masterminds/semver/v3 v3.1.0 // indirect
	github.com/fsnotify/fsnotify v1.4.9 // indirect
	github.com/gobuffalo/buffalo v0.16.15
	github.com/gobuffalo/envy v1.9.0
	github.com/gobuffalo/fizz v1.13.0 // indirect
	github.com/gobuffalo/mw-csrf v1.0.0
	github.com/gobuffalo/mw-i18n v1.1.0
	github.com/gobuffalo/mw-paramlogger v1.0.0
	github.com/gobuffalo/nulls v0.4.0 // indirect
	github.com/gobuffalo/packr/v2 v2.8.0
	github.com/gobuffalo/pop/v5 v5.2.4 // indirect
	github.com/gobuffalo/suite v2.8.2+incompatible
	github.com/gobuffalo/validate/v3 v3.3.0 // indirect
	github.com/gofrs/uuid v3.3.0+incompatible // indirect
	github.com/gorilla/handlers v1.5.0 // indirect
	github.com/gorilla/mux v1.8.0 // indirect
	github.com/gorilla/sessions v1.2.1 // indirect
	github.com/jackc/pgproto3/v2 v2.0.4 // indirect
	github.com/jackc/pgx/v4 v4.8.1 // indirect
	github.com/jbowtie/gokogiri v0.0.0-20190301021639-37f655d3078f // indirect
	github.com/karrick/godirwalk v1.16.1 // indirect
	github.com/lib/pq v1.8.0 // indirect
	github.com/markbates/grift v1.5.0
	github.com/mattn/go-colorable v0.1.7 // indirect
	github.com/microcosm-cc/bluemonday v1.0.4 // indirect
	github.com/opencontrol/compliance-masonry v1.1.6
	github.com/opencontrol/compliance-masonry/commands/docs v0.0.0-00010101000000-000000000000 // indirect
	github.com/opencontrol/compliance-masonry/models v0.0.0-00010101000000-000000000000 // indirect
	github.com/opencontrol/fedramp-templater v0.0.0-00010101000000-000000000000
	github.com/rogpeppe/go-internal v1.6.2 // indirect
	github.com/rolieup/golie v0.2.1
	github.com/sirupsen/logrus v1.6.0 // indirect
	github.com/spf13/cobra v1.0.0 // indirect
	github.com/stretchr/testify v1.6.1 // indirect
	github.com/xlab/handysort v0.0.0-20150421192137-fb3537ed64a1 // indirect
	golang.org/x/crypto v0.0.0-20200820211705-5c72a883971a // indirect
	golang.org/x/net v0.0.0-20200904194848-62affa334b73 // indirect
	golang.org/x/sync v0.0.0-20200625203802-6e8e738ad208 // indirect
	golang.org/x/sys v0.0.0-20200909081042-eff7692f9009 // indirect
	golang.org/x/xerrors v0.0.0-20200804184101-5ec99f83aff1 // indirect
	gopkg.in/yaml.v2 v2.3.0 // indirect
	gopkg.in/yaml.v3 v3.0.0-20200615113413-eeeca48fe776 // indirect
)

replace (
	github.com/codegangsta/cli => github.com/urfave/cli v1.18.1-0.20160712171436-3a5216227e14
	github.com/go-utils/ufs => ./vendor/github.com/opencontrol/fedramp-templater/vendor/github.com/go-utils/ufs
	github.com/go-utils/ugo => ./vendor/github.com/opencontrol/fedramp-templater/vendor/github.com/go-utils/ugo
	github.com/go-utils/uslice => ./vendor/github.com/opencontrol/fedramp-templater/vendor/github.com/go-utils/uslice
	github.com/go-utils/ustr => ./vendor/github.com/opencontrol/fedramp-templater/vendor/github.com/go-utils/ustr
	github.com/opencontrol/compliance-masonry/commands/docs => ./vendor/github.com/opencontrol/fedramp-templater/vendor/github.com/opencontrol/compliance-masonry/commands/docs
	github.com/opencontrol/compliance-masonry/config => ./vendor/github.com/opencontrol/fedramp-templater/vendor/github.com/opencontrol/compliance-masonry/config
	github.com/opencontrol/compliance-masonry/models => ./vendor/github.com/opencontrol/fedramp-templater/vendor/github.com/opencontrol/compliance-masonry/models
	github.com/opencontrol/fedramp-templater => ./vendor/github.com/opencontrol/fedramp-templater
	gopkg.in/fatih/set.v0 => ./vendor/github.com/opencontrol/fedramp-templater/vendor/github.com/opencontrol/compliance-masonry/vendor/gopkg.in/fatih/set.v0
	vbom.ml/util => github.com/fvbommel/util v0.0.0-20180919145318-efcd4e0f9787
)
