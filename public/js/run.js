var calendar;

var freeTimeStr = 'Tempo disponível';

$(document).ready(function()
                  {
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  calendar = $('#calendar').fullCalendar(
    {
      lang:'pt-br',

      header:
      {
        left: '',
        center: '',
        right: ''
      },
      defaultView: 'agendaWeek',

      selectable: true,
      selectHelper: true,

      select: function(start, end, allDay)
      {
        allDay = false;
        //var title = prompt('Event Title:');
        var title = freeTimeStr;
        
        if (title)
        {
          calendar.fullCalendar('renderEvent',
                                {
            title: title,
            start: start,
            end: end,
            allDay: allDay,
            //color: '#16174f'
          },
                                true // make the event "stick"
                               );
        }
        calendar.fullCalendar('unselect');
      },
      /*
					editable: true allow user to edit events.
				*/
      editable: true
    });

});


function toggleCalendar() {
  $('#calendar').toggle();
}

function isFreeTime(eventdata) {
  return eventdata.title == freeTimeStr;
}

function transformFreeTimeIntoStudy() {
  var subjects = getSubjects();
  freeTimeEvents = calendar.fullCalendar('clientEvents', isFreeTime);
  freeTimeEvents.forEach(function(event) {
    divideIntoStudyEvents(event, subjects);
  });
  calendar.fullCalendar('removeEvents', isFreeTime);
  console.log(calendar.fullCalendar('clientEvents', function(event){return event.title=='MAT';}))
}

function cleanSchedule(){
  calendar.fullCalendar('removeEvents');
}

function divideIntoStudyEvents(event, subjects) {
  minuteDiff = event.end.diff(event.start, 'minutes');
  var studyDuration = 30;
  
  var numFullIntervals = Math.floor(minuteDiff / studyDuration);
  for(var k = 0; k != numFullIntervals; ++k) {
    addNewEvent(subjects.next().value, event.start.clone().add(k*studyDuration, 'm'), studyDuration);
  }
  var elapsed = numFullIntervals*studyDuration;
  if(minuteDiff - elapsed >= 30)
    addNewEvent(subjects.next().value, event.start.clone().add(elapsed, 'm'), minuteDiff - elapsed);
}

function addNewEvent(title, start, duration) {
  calendar.fullCalendar('renderEvent',
          {
            title: title,
            start: start,
            end: start.clone().add(duration, 'm'),
            allDay: false,
            color: '#d63019'
          },
          true
         );
}

var subjectForm = "<div class='materia'><p><input placeholder='Matéria' class='subject-form'></p><p>Fácil<input class='dif' type='range' max='5' min='1' step='1' style='width:50px; margin: auto'>Difícil</p></div>";



function addSubjectForm() {
  $('#subject-list').append(subjectForm);
}


function* getSubjects(){
  var subjs = $('.subject-form').toArray().map(x => x.value);
  var difs = $('.dif').toArray().map(x => x.value);
  console.log(subjs);
  console.log(difs);
  for (var i = 0; i < difs.length; i++){
    for (var j = 1; j < difs[i]; j++)
      subjs.push(subjs[i]);
  }
  console.log(subjs);
  while(true) {
    shuffleArray(subjs);
    for(var i = 0; i != subjs.length; ++i)
      yield subjs[i];

    if (!subjs.length)
      yield 'Matemática';
  } 
}

function shuffleArray(arr) {
  var j;
  var temp;
  for(var i = arr.length - 1; i > 0; --i) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

function removeAllEvents() {
  $('#subject-list').html('');
  calendar.fullCalendar('removeEvents');
}