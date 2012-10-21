#!/usr/bin/env ruby

def getChildren dir, pattern=/./, dir_pattern=nil
  
  # validate directory
  raise "#{dir} is not a directory" unless File.directory? dir
  
  # look at each file in the directory
  `ls #{dir}`.split("\n").map do |file|
    
    # recursively add the contents of directories
    (File.directory? "#{dir}/#{file}") ?
    (getChildren "#{dir}/#{file}", pattern, dir_pattern) :
      
      # dir matches
      (dir_pattern and dir_pattern.match dir) ?
    "#{dir}/#{file}" :
      
      # file matches
      (pattern.match file) ?
    "#{dir}/#{file}" :
      
      # file doesn't match
      nil
    
  end.delete_if{|f| f.nil?}.flatten
end

(getChildren ".", /\.test\./, /\/tests\b/).each do |file|
  puts "\n#{file}"
  puts `node #{file}`
end