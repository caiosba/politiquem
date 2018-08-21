require 'json'
data = JSON.parse(File.read('temas.json'))
data3 = JSON.parse(File.read('perfis.json'))
data2 = {}
data.each do |pm|
  next if pm['report_status'] != 'verified'
  n = pm['tasks_resolved_count'].to_i
  n.times do |index|
    i = index + 1
    name = pm["task_question_#{i}"]
    data2[name] ||= { subjects: {}, fields: {} }
    data2[name][:subjects][pm['report_title']] = pm["task_answer_#{i}"]
  end
end
data3.each do |pm|
  next if pm['report_status'] != 'verified'
  n = pm['tasks_resolved_count'].to_i
  name = pm['report_title']
  n.times do |index|
    i = index + 1
    next unless data2.has_key?(name)
    data2[name][:fields][pm["task_question_#{i}"]] = pm["task_answer_#{i}"]
  end
end
puts data2.to_json
