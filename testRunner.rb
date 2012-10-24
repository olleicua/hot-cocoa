#!/usr/bin/env ruby

def getChildren dir, file_pattern=/./, dir_pattern=nil
  
  # validate directory
  raise "#{dir} is not a directory" unless File.directory? dir
  
  # look at each file in the directory
  `ls #{dir}`.split("\n").map do |file|
    
    # recursively add the contents of directories
    (File.directory? "#{dir}/#{file}") ?
    (getChildren "#{dir}/#{file}", file_pattern, dir_pattern) :
      
      # dir matches
      (dir_pattern and dir_pattern.match dir) ?
    "#{dir}/#{file}" :
      
      # file matches
      (file_pattern.match file) ?
    "#{dir}/#{file}" :
      
      # file doesn't match
      nil
    
  end.delete_if{|f| f.nil?}.flatten
end

total = 0
passed = 0
(getChildren ".", /\.test\./, /\/tests\b/).each do |file|
  puts "\n#{file}"
  test = `node #{file}`
  puts test
  _,t,p = (/Passed (\d+) of (\d+) tests\./.match test).to_a
  total += t.to_i
  passed += p.to_i
end

puts "\n ---\nPasses #{total} of #{passed} tests."
