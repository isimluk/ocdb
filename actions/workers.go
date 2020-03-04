package actions

import (
	"github.com/RedHatGov/ocdb/pkg/cac"
	"github.com/RedHatGov/ocdb/pkg/masonry"
	"github.com/gobuffalo/buffalo/worker"
	"time"
)

type Job func()

func Xinit() {
	w := App().Worker
	SetUpJob(w, "refresh_masonry", masonry.Refresh)
	SetUpJob(w, "refresh_cac", cac.Refresh)
}

func SetUpJob(w worker.Worker, name string, job Job) {
	w.Register(name, func(args worker.Args) error {
		RescheduleJob(name, time.Hour)
		job()
		return nil
	})
	RescheduleJob(name, time.Second)
}

func RescheduleJob(handlerName string, period time.Duration) {
	w := App().Worker
	w.PerformIn(worker.Job{
		Queue:   "masonry",
		Handler: handlerName,
	}, period)

}
