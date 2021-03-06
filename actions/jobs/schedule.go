package jobs

import (
	"github.com/RedHatGov/ocdb/pkg/cac"
	"github.com/RedHatGov/ocdb/pkg/masonry"
	"github.com/gobuffalo/buffalo/worker"
)

var List = []Job{
	Job{
		Name: "Open Control Masonry Refresh",
		Fn:   masonry.Refresh,
	},
	Job{
		Name: "ComplianceAsCode Rebuild",
		Fn:   cac.Refresh,
	},
}

func Init(worker worker.Worker) {
	for i, _ := range List {
		job := &(List[i])
		job.setUpIn(worker)
	}
}
