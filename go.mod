module github.com/RedHatGov/ocdb

go 1.13

require (
	github.com/gobuffalo/buffalo v0.16.15
	github.com/gobuffalo/envy v1.9.0
	github.com/gobuffalo/mw-csrf v1.0.0
	github.com/gobuffalo/mw-forcessl v0.0.0-20200131175327-94b2bd771862
	github.com/gobuffalo/mw-i18n v1.1.0
	github.com/gobuffalo/mw-paramlogger v1.0.0
	github.com/gobuffalo/packr v1.25.0
	github.com/gobuffalo/packr/v2 v2.8.0
	github.com/gobuffalo/pop v4.13.1+incompatible
	github.com/gobuffalo/suite v2.8.2+incompatible
	github.com/jbowtie/gokogiri v0.0.0-20190301021639-37f655d3078f // indirect
	github.com/markbates/grift v1.5.0
	github.com/opencontrol/compliance-masonry v1.1.6
	github.com/opencontrol/compliance-masonry/commands/docs v0.0.0-00010101000000-000000000000 // indirect
	github.com/opencontrol/compliance-masonry/models v0.0.0-00010101000000-000000000000 // indirect
	github.com/opencontrol/fedramp-templater v0.0.0-00010101000000-000000000000
	github.com/rolieup/golie v0.2.0
	github.com/unrolled/secure v1.0.7
	github.com/xlab/handysort v0.0.0-20150421192137-fb3537ed64a1 // indirect
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
